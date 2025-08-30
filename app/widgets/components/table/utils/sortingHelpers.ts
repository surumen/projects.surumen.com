// app/widgets/components/table/utils/sortingHelpers.ts
// Utility functions for sorting management

import type { SortConfig, SortDirection, SortFunction } from '../types'

/**
 * Default sort function for basic data types
 */
export const defaultSortFunction = <T>(
  a: T,
  b: T,
  key: keyof T,
  direction: SortDirection = 'asc'
): number => {
  const aVal = a[key]
  const bVal = b[key]
  
  // Handle null/undefined values
  if (aVal == null && bVal == null) return 0
  if (aVal == null) return direction === 'asc' ? -1 : 1
  if (bVal == null) return direction === 'asc' ? 1 : -1
  
  // Handle different data types
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    const result = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
    return direction === 'asc' ? result : -result
  }
  
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    const result = aVal - bVal
    return direction === 'asc' ? result : -result
  }
  
  if (aVal instanceof Date && bVal instanceof Date) {
    const result = aVal.getTime() - bVal.getTime()
    return direction === 'asc' ? result : -result
  }
  
  // Fallback to string comparison
  const result = String(aVal).localeCompare(String(bVal))
  return direction === 'asc' ? result : -result
}

/**
 * Apply sorting to data array
 */
export const applySorting = <T>(
  data: T[],
  sortConfigs: SortConfig[],
  customSorters?: Record<string, SortFunction<T>>
): T[] => {
  if (sortConfigs.length === 0) return data
  
  return [...data].sort((a, b) => {
    // Sort by each config in priority order
    for (const config of sortConfigs) {
      const customSorter = customSorters?.[config.key]
      let result: number
      
      if (customSorter) {
        result = customSorter(a, b, config.direction)
      } else {
        result = defaultSortFunction(a, b, config.key as keyof T, config.direction)
      }
      
      if (result !== 0) {
        return result
      }
    }
    
    return 0
  })
}

/**
 * Toggle sort direction for a column
 */
export const toggleSortDirection = (currentDirection: SortDirection | null): SortDirection => {
  if (currentDirection === 'asc') return 'desc'
  return 'asc'
}

/**
 * Find sort config for a column
 */
export const findSortConfig = (sortConfigs: SortConfig[], columnKey: string): SortConfig | undefined => {
  return sortConfigs.find(config => config.key === columnKey)
}

/**
 * Add or update sort config
 */
export const addOrUpdateSort = (
  sortConfigs: SortConfig[],
  columnKey: string,
  direction: SortDirection,
  multiSort = false
): SortConfig[] => {
  const existingIndex = sortConfigs.findIndex(config => config.key === columnKey)
  
  if (existingIndex !== -1) {
    // Update existing sort
    const newConfigs = [...sortConfigs]
    newConfigs[existingIndex] = { ...newConfigs[existingIndex], direction }
    return newConfigs
  } else {
    // Add new sort
    const newConfig: SortConfig = {
      key: columnKey,
      direction,
      priority: sortConfigs.length
    }
    
    if (multiSort) {
      return [...sortConfigs, newConfig]
    } else {
      return [newConfig]
    }
  }
}

/**
 * Remove sort config for a column
 */
export const removeSort = (sortConfigs: SortConfig[], columnKey: string): SortConfig[] => {
  return sortConfigs
    .filter(config => config.key !== columnKey)
    .map((config, index) => ({ ...config, priority: index })) // Reindex priorities
}

/**
 * Clear all sort configs
 */
export const clearAllSorts = (): SortConfig[] => {
  return []
}

/**
 * Get sort direction for a specific column
 */
export const getSortDirection = (sortConfigs: SortConfig[], columnKey: string): SortDirection | null => {
  const config = findSortConfig(sortConfigs, columnKey)
  return config?.direction ?? null
}

/**
 * Check if a column is sorted
 */
export const isColumnSorted = (sortConfigs: SortConfig[], columnKey: string): boolean => {
  return findSortConfig(sortConfigs, columnKey) !== undefined
}

/**
 * Get sort priority for a column (for multi-sort display)
 */
export const getSortPriority = (sortConfigs: SortConfig[], columnKey: string): number | null => {
  const config = findSortConfig(sortConfigs, columnKey)
  return config?.priority ?? null
}

/**
 * Generate ARIA sort attributes for accessibility
 */
export const getSortAriaAttributes = (
  sortConfigs: SortConfig[],
  columnKey: string
): {
  'aria-sort': 'ascending' | 'descending' | 'none'
  'aria-label': string
} => {
  const direction = getSortDirection(sortConfigs, columnKey)
  
  return {
    'aria-sort': direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none',
    'aria-label': direction 
      ? `Sort by this column ${direction === 'asc' ? 'descending' : 'ascending'}`
      : 'Sort by this column ascending'
  }
}
