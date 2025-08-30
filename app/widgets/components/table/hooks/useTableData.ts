// app/widgets/components/table/hooks/useTableData.ts
// Basic data processing and state management hook

import { useState, useMemo, useCallback } from 'react'
import type { TableLoadingConfig, TableErrorConfig } from '../types'

/**
 * Configuration for useTableData hook
 */
export interface UseTableDataConfig<T> {
  /** Initial data */
  data: T[]
  /** Loading configuration */
  loading?: boolean | TableLoadingConfig
  /** Error configuration */
  error?: boolean | TableErrorConfig
  /** Key extractor function */
  keyBy?: keyof T | ((item: T) => string | number)
}

/**
 * Return type for useTableData hook
 */
export interface UseTableDataReturn<T> {
  /** Processed data */
  data: T[]
  /** Loading state */
  loading: TableLoadingConfig
  /** Error state */
  error: TableErrorConfig
  /** Total item count */
  totalItems: number
  /** Key extractor function */
  getRowKey: (item: T, index?: number) => string | number
  /** Data validation */
  isValid: boolean
  /** Refresh data (for error recovery) */
  refresh: () => void
}

/**
 * Hook for basic table data management
 */
export const useTableData = <T = any>({
  data,
  loading = false,
  error = false,
  keyBy = 'id' as keyof T
}: UseTableDataConfig<T>): UseTableDataReturn<T> => {
  const [refreshKey, setRefreshKey] = useState(0)

  // Normalize loading config
  const loadingConfig: TableLoadingConfig = useMemo(() => {
    if (typeof loading === 'boolean') {
      return {
        isLoading: loading,
        rowCount: 5,
        message: 'Loading...'
      }
    }
    return {
      rowCount: 5,
      message: 'Loading...',
      ...loading,
      isLoading: loading.isLoading ?? false
    }
  }, [loading])

  // Normalize error config
  const errorConfig: TableErrorConfig = useMemo(() => {
    if (typeof error === 'boolean') {
      return {
        hasError: error,
        message: 'An error occurred while loading data'
      }
    }
    return {
      message: 'An error occurred while loading data',
      ...error,
      hasError: error.hasError ?? false
    }
  }, [error])

  // Process and validate data
  const processedData = useMemo(() => {
    // Don't process data while loading
    if (loadingConfig.isLoading) {
      return []
    }

    // Don't process data if there's an error
    if (errorConfig.hasError) {
      return []
    }

    // Basic validation - ensure data is an array
    if (!Array.isArray(data)) {
      console.warn('useTableData: data must be an array')
      return []
    }

    return data
  }, [data, loadingConfig.isLoading, errorConfig.hasError])

  // Create key extractor function
  const getRowKey = useCallback((item: T, index?: number): string | number => {
    if (typeof keyBy === 'function') {
      return keyBy(item)
    }
    
    if (typeof keyBy === 'string' && item && typeof item === 'object') {
      const key = (item as any)[keyBy]
      if (key != null) return key
    }

    // Fallback to index if no valid key found
    if (typeof index === 'number') {
      return index
    }

    // Last resort fallback
    return Math.random().toString(36).substring(2, 9)
  }, [keyBy])

  // Validate data integrity
  const isValid = useMemo(() => {
    if (!Array.isArray(data)) return false
    if (errorConfig.hasError) return false
    
    // Check for duplicate keys
    try {
      const keys = new Set()
      for (let i = 0; i < processedData.length; i++) {
        const key = getRowKey(processedData[i], i)
        if (keys.has(key)) {
          console.warn(`useTableData: Duplicate row key found: ${key}`)
          return false
        }
        keys.add(key)
      }
      return true
    } catch (err) {
      console.error('useTableData: Error validating data', err)
      return false
    }
  }, [processedData, getRowKey, errorConfig.hasError, data])

  // Refresh function for error recovery
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
    if (errorConfig.onRetry) {
      errorConfig.onRetry()
    }
  }, [errorConfig])

  return {
    data: processedData,
    loading: loadingConfig,
    error: errorConfig,
    totalItems: processedData.length,
    getRowKey,
    isValid,
    refresh
  }
}
