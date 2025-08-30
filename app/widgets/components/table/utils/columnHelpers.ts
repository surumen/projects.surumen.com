// app/widgets/components/table/utils/columnHelpers.ts
// Utility functions for column management

import type { ColumnConfig } from '../types'

/**
 * Generate a unique column key if not provided
 */
export const generateColumnKey = (index: number): string => {
  return `column-${index}`
}

/**
 * Sort columns by their index
 */
export const sortColumnsByIndex = <T>(columns: ColumnConfig<T>[]): ColumnConfig<T>[] => {
  return [...columns].sort((a, b) => a.index - b.index)
}

/**
 * Get visible columns only
 */
export const getVisibleColumns = <T>(columns: ColumnConfig<T>[]): ColumnConfig<T>[] => {
  return columns.filter(column => column.visible !== false)
}

/**
 * Find column by key
 */
export const findColumnByKey = <T>(columns: ColumnConfig<T>[], key: string): ColumnConfig<T> | undefined => {
  return columns.find(column => column.key === key)
}

/**
 * Update column in array
 */
export const updateColumn = <T>(
  columns: ColumnConfig<T>[], 
  key: string, 
  updates: Partial<ColumnConfig<T>>
): ColumnConfig<T>[] => {
  return columns.map(column => 
    column.key === key ? { ...column, ...updates } : column
  )
}

/**
 * Remove column from array
 */
export const removeColumn = <T>(columns: ColumnConfig<T>[], key: string): ColumnConfig<T>[] => {
  return columns.filter(column => column.key !== key)
}
