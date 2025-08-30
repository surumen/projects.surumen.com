// app/widgets/components/table/hooks/useTableSorting.ts
// Sorting logic and state management hook

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { 
  SortConfig, 
  SortDirection, 
  SortState, 
  SortingConfig,
  SortFunction,
  SortHelpers,
  SortProps,
  UseTableSortingConfig,
  UseTableSortingReturn
} from '../types'
import {
  applySorting,
  toggleSortDirection,
  findSortConfig,
  addOrUpdateSort,
  removeSort,
  clearAllSorts,
  getSortDirection,
  isColumnSorted,
  getSortPriority,
  getSortAriaAttributes
} from '../utils/sortingHelpers'

/**
 * Hook for managing table sorting
 */
export const useTableSorting = <T = any>({
  data,
  enabled = true,
  multiSort = false,
  defaultSort,
  customSorters,
  preserveSort = false,
  sortBy,
  onSortChange
}: UseTableSortingConfig<T>): UseTableSortingReturn<T> => {
  // Initialize default sort configuration
  const initialSort = useMemo((): SortConfig[] => {
    if (!enabled || !defaultSort) return []
    
    if (Array.isArray(defaultSort)) {
      return defaultSort.map((sort, index) => ({
        ...sort,
        priority: index
      }))
    }
    
    return [{ ...defaultSort, priority: 0 }]
  }, [enabled, defaultSort])

  // Internal sort state (used when not controlled)
  const [internalSortBy, setInternalSortBy] = useState<SortConfig[]>(initialSort)

  // Determine if sorting is controlled
  const isControlled = sortBy !== undefined
  const currentSortBy = isControlled ? sortBy : internalSortBy

  // Create sort state object
  const sortState: SortState = useMemo(() => ({
    sortBy: currentSortBy,
    multiSort
  }), [currentSortBy, multiSort])

  // Handle sort changes
  const handleSortChange = useCallback((newSortConfigs: SortConfig[]) => {
    // Update internal state if not controlled
    if (!isControlled) {
      setInternalSortBy(newSortConfigs)
    }
    
    // Call external handler
    if (onSortChange) {
      onSortChange(newSortConfigs)
    }
  }, [isControlled, onSortChange])

  // Apply sorting to data
  const sortedData = useMemo(() => {
    if (!enabled || currentSortBy.length === 0) {
      return data
    }
    
    return applySorting(data, currentSortBy, customSorters)
  }, [data, currentSortBy, customSorters, enabled])

  // Sort actions
  const sortByColumn = useCallback((columnKey: string, direction?: SortDirection) => {
    if (!enabled) return
    
    const targetDirection = direction || 'asc'
    const newSortConfigs = addOrUpdateSort(currentSortBy, columnKey, targetDirection, multiSort)
    handleSortChange(newSortConfigs)
  }, [enabled, currentSortBy, multiSort, handleSortChange])

  const addSort = useCallback((columnKey: string, direction: SortDirection) => {
    if (!enabled || !multiSort) return sortByColumn(columnKey, direction)
    
    const newSortConfigs = addOrUpdateSort(currentSortBy, columnKey, direction, true)
    handleSortChange(newSortConfigs)
  }, [enabled, multiSort, currentSortBy, handleSortChange, sortByColumn])

  const removeColumnSort = useCallback((columnKey: string) => {
    if (!enabled) return
    
    const newSortConfigs = removeSort(currentSortBy, columnKey)
    handleSortChange(newSortConfigs)
  }, [enabled, currentSortBy, handleSortChange])

  const clearSort = useCallback(() => {
    if (!enabled) return
    
    handleSortChange(clearAllSorts())
  }, [enabled, handleSortChange])

  const toggleSort = useCallback((columnKey: string) => {
    if (!enabled) return
    
    const currentDirection = getSortDirection(currentSortBy, columnKey)
    
    if (currentDirection === null) {
      // Start with ascending
      sortByColumn(columnKey, 'asc')
    } else if (currentDirection === 'asc') {
      // Switch to descending
      sortByColumn(columnKey, 'desc')
    } else {
      // Remove sort (or cycle back to asc in multi-sort mode)
      if (multiSort) {
        sortByColumn(columnKey, 'asc')
      } else {
        removeColumnSort(columnKey)
      }
    }
  }, [enabled, currentSortBy, sortByColumn, removeColumnSort, multiSort])

  // Helper functions
  const getSortDirectionForColumn = useCallback((columnKey: string): SortDirection | null => {
    return getSortDirection(currentSortBy, columnKey)
  }, [currentSortBy])

  const isSorted = useCallback((columnKey: string): boolean => {
    return isColumnSorted(currentSortBy, columnKey)
  }, [currentSortBy])

  const getSortPriorityForColumn = useCallback((columnKey: string): number | null => {
    return getSortPriority(currentSortBy, columnKey)
  }, [currentSortBy])

  const getSortProps = useCallback((columnKey: string): SortProps => {
    const direction = getSortDirectionForColumn(columnKey)
    const priority = getSortPriorityForColumn(columnKey)
    const ariaAttributes = getSortAriaAttributes(currentSortBy, columnKey)
    
    return {
      isSorted: direction !== null,
      direction,
      priority,
      onClick: () => toggleSort(columnKey),
      ...ariaAttributes
    }
  }, [currentSortBy, getSortDirectionForColumn, getSortPriorityForColumn, toggleSort])

  // Reset sort when data changes significantly (if not preserving)
  useEffect(() => {
    if (!preserveSort && !isControlled && data.length === 0) {
      setInternalSortBy([])
    }
  }, [data.length, preserveSort, isControlled])

  return {
    // Data
    sortedData,
    sortingEnabled: enabled,
    
    // State
    sortState,
    
    // Actions
    sortBy: sortByColumn,
    addSort,
    removeSort: removeColumnSort,
    clearSort,
    toggleSort,
    
    // Helpers
    getSortDirection: getSortDirectionForColumn,
    isSorted,
    getSortPriority: getSortPriorityForColumn,
    getSortProps
  }
}
