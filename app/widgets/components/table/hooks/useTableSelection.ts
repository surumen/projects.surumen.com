// app/widgets/components/table/hooks/useTableSelection.ts
// Selection logic and state management hook

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { 
  SelectionMode, 
  SelectionConfig, 
  SelectionState, 
  SelectionAction,
  CheckboxProps,
  UseTableSelectionConfig
} from '../types'
import {
  defaultKeyExtractor,
  isItemSelected,
  addToSelection,
  removeFromSelection,
  toggleSelection,
  areAllItemsSelected,
  areSomeItemsSelected,
  createSelectAllProps,
  createItemProps,
  canSelectMore,
  enforceSelectionLimits
} from '../utils/selectionHelpers'

/**
 * Hook for managing table row selection
 */
export const useTableSelection = <T = any>({
  data,
  mode = 'multiple',
  keyBy,
  defaultSelected = [],
  selected,
  onSelectionChange,
  preserveSelection = false,
  maxSelection,
  showCheckboxes = true
}: UseTableSelectionConfig<T>): SelectionState<T> => {
  // Internal selection state (used when not controlled)
  const [internalSelection, setInternalSelection] = useState<T[]>(defaultSelected)

  // Determine if selection is controlled
  const isControlled = selected !== undefined
  const currentSelection = isControlled ? selected : internalSelection

  // Key extractor function
  const getItemKey = useCallback((item: T): string | number => {
    return defaultKeyExtractor(item, keyBy)
  }, [keyBy])

  // Update internal selection when data changes (if not preserving selection)
  useEffect(() => {
    if (!preserveSelection && !isControlled) {
      // Filter out items that no longer exist in the data
      const validSelection = currentSelection.filter(selectedItem =>
        data.some(dataItem => getItemKey(dataItem) === getItemKey(selectedItem))
      )
      
      if (validSelection.length !== currentSelection.length) {
        setInternalSelection(validSelection)
      }
    }
  }, [data, currentSelection, getItemKey, preserveSelection, isControlled])

  // Selection state calculations
  const selectionState = useMemo(() => {
    const selectedCount = currentSelection.length
    const hasSelected = selectedCount > 0
    const isAllSelected = areAllItemsSelected(data, currentSelection, getItemKey)
    const isSomeSelected = areSomeItemsSelected(data, currentSelection, getItemKey)

    return {
      selectedCount,
      hasSelected,
      isAllSelected,
      isSomeSelected
    }
  }, [data, currentSelection, getItemKey])

  // Selection change handler
  const handleSelectionChange = useCallback((
    newSelection: T[], 
    action: SelectionAction = 'select-multiple'
  ) => {
    // Enforce selection limits
    const limitedSelection = enforceSelectionLimits(newSelection, maxSelection)
    
    // Update internal state if not controlled
    if (!isControlled) {
      setInternalSelection(limitedSelection)
    }
    
    // Call external handler
    if (onSelectionChange) {
      onSelectionChange(limitedSelection)
    }
  }, [isControlled, onSelectionChange, maxSelection])

  // Selection actions
  const selectAll = useCallback(() => {
    if (mode === 'none') return
    handleSelectionChange(data, 'select-all')
  }, [mode, data, handleSelectionChange])

  const clearSelection = useCallback(() => {
    handleSelectionChange([], 'clear-all')
  }, [handleSelectionChange])

  const toggleAll = useCallback(() => {
    if (mode === 'none') return
    const action = selectionState.isAllSelected ? 'clear-all' : 'select-all'
    const newSelection = selectionState.isAllSelected ? [] : data
    handleSelectionChange(newSelection, action)
  }, [mode, selectionState.isAllSelected, data, handleSelectionChange])

  const selectItem = useCallback((item: T) => {
    if (mode === 'none') return
    if (!canSelectMore(currentSelection, maxSelection) && !isItemSelected(item, currentSelection, getItemKey)) {
      return // Can't select more items
    }
    
    const newSelection = mode === 'single' 
      ? [item]
      : addToSelection(item, currentSelection, getItemKey)
    
    handleSelectionChange(newSelection, 'select-item')
  }, [mode, currentSelection, maxSelection, getItemKey, handleSelectionChange])

  const deselectItem = useCallback((item: T) => {
    const newSelection = removeFromSelection(item, currentSelection, getItemKey)
    handleSelectionChange(newSelection, 'deselect-item')
  }, [currentSelection, getItemKey, handleSelectionChange])

  const toggleItem = useCallback((item: T) => {
    if (mode === 'none') return
    
    const itemIsSelected = isItemSelected(item, currentSelection, getItemKey)
    
    if (!itemIsSelected && !canSelectMore(currentSelection, maxSelection)) {
      return // Can't select more items
    }
    
    const newSelection = mode === 'single' && !itemIsSelected
      ? [item] // Single mode: replace selection
      : toggleSelection(item, currentSelection, getItemKey)
    
    handleSelectionChange(newSelection, 'toggle-item')
  }, [mode, currentSelection, maxSelection, getItemKey, handleSelectionChange])

  const selectItems = useCallback((items: T[]) => {
    if (mode === 'none') return
    
    const newSelection = mode === 'single' 
      ? items.slice(0, 1) // Take only first item in single mode
      : enforceSelectionLimits([...currentSelection, ...items], maxSelection)
    
    handleSelectionChange(newSelection, 'select-multiple')
  }, [mode, currentSelection, maxSelection, handleSelectionChange])

  // Helper functions
  const isSelected = useCallback((item: T): boolean => {
    return isItemSelected(item, currentSelection, getItemKey)
  }, [currentSelection, getItemKey])

  // Props generators for UI components
  const getSelectAllProps = useCallback((): CheckboxProps => {
    return createSelectAllProps(
      selectionState.isAllSelected,
      selectionState.isSomeSelected,
      toggleAll
    )
  }, [selectionState.isAllSelected, selectionState.isSomeSelected, toggleAll])

  const getItemProps = useCallback((item: T): CheckboxProps => {
    return createItemProps(item, currentSelection, getItemKey, toggleItem)
  }, [currentSelection, getItemKey, toggleItem])

  // Return selection state and actions
  return {
    selectedItems: currentSelection,
    selectedCount: selectionState.selectedCount,
    hasSelected: selectionState.hasSelected,
    isAllSelected: selectionState.isAllSelected,
    isSomeSelected: selectionState.isSomeSelected,
    
    // Actions
    selectAll,
    clearSelection,
    toggleAll,
    toggleItem,
    selectItem,
    deselectItem,
    selectItems,
    
    // Helpers
    isSelected,
    getItemKey,
    
    // Props generators
    getSelectAllProps,
    getItemProps
  }
}
