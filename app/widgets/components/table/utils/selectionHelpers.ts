// app/widgets/components/table/utils/selectionHelpers.ts
// Utility functions for selection management

import type { CheckboxProps } from '../types'

/**
 * Default key extractor function
 */
export const defaultKeyExtractor = <T>(item: T, keyBy?: keyof T | ((item: T) => string | number)): string | number => {
  if (typeof keyBy === 'function') {
    return keyBy(item)
  }
  if (typeof keyBy === 'string' && item && typeof item === 'object') {
    return (item as any)[keyBy]
  }
  // Fallback to 'id' property or object reference
  return (item as any)?.id ?? item
}

/**
 * Check if an item is selected in a selection array
 */
export const isItemSelected = <T>(
  item: T,
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): boolean => {
  const itemKey = keyExtractor(item)
  return selectedItems.some(selected => keyExtractor(selected) === itemKey)
}

/**
 * Add item to selection array
 */
export const addToSelection = <T>(
  item: T,
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): T[] => {
  if (isItemSelected(item, selectedItems, keyExtractor)) {
    return selectedItems // Already selected
  }
  return [...selectedItems, item]
}

/**
 * Remove item from selection array
 */
export const removeFromSelection = <T>(
  item: T,
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): T[] => {
  const itemKey = keyExtractor(item)
  return selectedItems.filter(selected => keyExtractor(selected) !== itemKey)
}

/**
 * Toggle item in selection array
 */
export const toggleSelection = <T>(
  item: T,
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): T[] => {
  return isItemSelected(item, selectedItems, keyExtractor)
    ? removeFromSelection(item, selectedItems, keyExtractor)
    : addToSelection(item, selectedItems, keyExtractor)
}

/**
 * Check if all items are selected
 */
export const areAllItemsSelected = <T>(
  items: T[],
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): boolean => {
  if (items.length === 0) return false
  return items.every(item => isItemSelected(item, selectedItems, keyExtractor))
}

/**
 * Check if some (but not all) items are selected
 */
export const areSomeItemsSelected = <T>(
  items: T[],
  selectedItems: T[],
  keyExtractor: (item: T) => string | number
): boolean => {
  const selectedCount = items.filter(item => 
    isItemSelected(item, selectedItems, keyExtractor)
  ).length
  
  return selectedCount > 0 && selectedCount < items.length
}

/**
 * Generate props for select-all checkbox
 */
export const createSelectAllProps = (
  isAllSelected: boolean,
  isSomeSelected: boolean,
  onToggle: () => void
): CheckboxProps => ({
  checked: isAllSelected,
  indeterminate: isSomeSelected,
  onChange: onToggle
})

/**
 * Generate props for individual item checkbox
 */
export const createItemProps = <T>(
  item: T,
  selectedItems: T[],
  keyExtractor: (item: T) => string | number,
  onToggle: (item: T) => void
): CheckboxProps => ({
  checked: isItemSelected(item, selectedItems, keyExtractor),
  indeterminate: false,
  onChange: () => onToggle(item)
})

/**
 * Validate selection limits
 */
export const canSelectMore = <T>(
  selectedItems: T[],
  maxSelection?: number
): boolean => {
  if (!maxSelection) return true
  return selectedItems.length < maxSelection
}

/**
 * Filter selection to respect limits
 */
export const enforceSelectionLimits = <T>(
  newSelection: T[],
  maxSelection?: number
): T[] => {
  if (!maxSelection) return newSelection
  return newSelection.slice(0, maxSelection)
}
