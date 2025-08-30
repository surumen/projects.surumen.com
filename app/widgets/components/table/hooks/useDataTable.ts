// app/widgets/components/table/hooks/useDataTable.ts
// Main composite hook that orchestrates all table functionality

import { useMemo, useCallback } from 'react'
import type { 
  DataTableProps,
  SelectionConfig,
  SortingConfig,
  SortConfig
} from '../types'
import { useTableData, UseTableDataConfig } from './useTableData'
import { useTableSelection, UseTableSelectionConfig } from './useTableSelection'
import { useTableSorting, UseTableSortingConfig } from './useTableSorting'

/**
 * Configuration for the main useDataTable hook
 */
export interface UseDataTableConfig<T = any> extends 
  Omit<UseTableDataConfig<T>, 'data'>,
  Partial<UseTableSelectionConfig<T>>,
  Partial<UseTableSortingConfig<T>> {
  /** Table data */
  data: T[]
  /** Selection configuration */
  selection?: SelectionConfig<T>
  /** Sorting configuration */  
  sorting?: SortingConfig<T>
  /** Controlled sort state */
  sortBy?: SortConfig[]
  /** Sort change callback */
  onSortChange?: (sortConfigs: SortConfig[]) => void
}

/**
 * Return type for the main useDataTable hook
 */
export interface UseDataTableReturn<T = any> {
  /** Table data and state for DataTable component */
  table: {
    /** Processed and sorted data */
    data: T[]
    /** Loading configuration */
    loading: boolean
    /** Error state */
    error: boolean
    /** Selection state */
    selection?: ReturnType<typeof useTableSelection<T>>
    /** Sorting state */
    sorting?: ReturnType<typeof useTableSorting<T>>
    /** Row key function */
    getRowKey: (item: T, index?: number) => string | number
    /** Sort handler */
    onSort?: (config: SortConfig) => void
  }
  
  /** Selection helpers for external components */
  selection: {
    /** Selected items */
    items: T[]
    /** Selection count */
    count: number  
    /** Whether any items are selected */
    hasItems: boolean
    /** Selection actions */
    actions: {
      selectAll: () => void
      clearSelection: () => void
      toggleItem: (item: T) => void
    }
  }
  
  /** Sorting helpers for external components */
  sorting: {
    /** Current sort configuration */
    sortBy: SortConfig[]
    /** Sort actions */
    actions: {
      sortBy: (columnKey: string, direction?: import('../types').SortDirection) => void
      clearSort: () => void
      toggleSort: (columnKey: string) => void
    }
  }
  
  /** Table metadata */
  meta: {
    /** Total items */
    totalItems: number
    /** Data validation status */
    isValid: boolean
  }
}

/**
 * Main composite hook for DataTable functionality
 */
export const useDataTable = <T = any>(config: UseDataTableConfig<T>): UseDataTableReturn<T> => {
  // Extract configuration
  const {
    data,
    keyBy,
    loading,
    error,
    selection: selectionConfig,
    sorting: sortingConfig,
    sortBy,
    onSortChange,
    ...rest
  } = config

  // Data management
  const dataHook = useTableData({
    data,
    keyBy,
    loading,
    error
  })

  // Sorting (applies before selection to maintain consistency)  
  const sortingHook = useTableSorting({
    data: dataHook.data,
    enabled: sortingConfig?.enabled,
    multiSort: sortingConfig?.multiSort,
    defaultSort: sortingConfig?.defaultSort,
    customSorters: sortingConfig?.customSorters,
    preserveSort: sortingConfig?.preserveSort,
    sortBy,
    onSortChange
  })

  // Selection (works with sorted data)
  const selectionHook = useTableSelection({
    data: sortingHook.sortedData,
    mode: selectionConfig?.mode ?? 'multiple',
    keyBy: selectionConfig?.keyBy ?? keyBy,
    defaultSelected: selectionConfig?.defaultSelected,
    selected: selectionConfig?.selected,
    onSelectionChange: selectionConfig?.onSelectionChange,
    preserveSelection: selectionConfig?.preserveSelection,
    maxSelection: selectionConfig?.maxSelection,
    showCheckboxes: selectionConfig?.showCheckboxes
  })

  // Sort handler for DataTable component
  const handleSort = useCallback((sortConfig: SortConfig) => {
    sortingHook.sortBy(sortConfig.key, sortConfig.direction)
  }, [sortingHook])

  // Assemble table props for DataTable component
  const tableProps = useMemo(() => ({
    data: sortingHook.sortedData,
    loading: dataHook.loading.isLoading,
    error: dataHook.error.hasError,
    selection: selectionConfig?.mode !== 'none' ? selectionHook : undefined,
    sorting: sortingConfig?.enabled !== false ? sortingHook : undefined,
    getRowKey: dataHook.getRowKey,
    onSort: sortingConfig?.enabled !== false ? handleSort : undefined
  }), [
    sortingHook,
    dataHook.loading.isLoading,
    dataHook.error.hasError,
    selectionConfig?.mode,
    selectionHook,
    sortingConfig?.enabled,
    dataHook.getRowKey,
    handleSort
  ])

  // Selection helpers for external components
  const selectionHelpers = useMemo(() => ({
    items: selectionHook.selectedItems,
    count: selectionHook.selectedCount,
    hasItems: selectionHook.hasSelected,
    actions: {
      selectAll: selectionHook.selectAll,
      clearSelection: selectionHook.clearSelection,
      toggleItem: selectionHook.toggleItem
    }
  }), [selectionHook])

  // Sorting helpers for external components
  const sortingHelpers = useMemo(() => ({
    sortBy: sortingHook.sortState.sortBy,
    actions: {
      sortBy: sortingHook.sortBy,
      clearSort: sortingHook.clearSort,
      toggleSort: sortingHook.toggleSort
    }
  }), [sortingHook])

  // Table metadata
  const meta = useMemo(() => ({
    totalItems: dataHook.totalItems,
    isValid: dataHook.isValid
  }), [dataHook])

  return {
    table: tableProps,
    selection: selectionHelpers,
    sorting: sortingHelpers,
    meta
  }
}
