// app/widgets/components/table/types/hooks.ts
// Hook configuration and return types

import type { 
  SelectionConfig, 
  SelectionState,
  SortingConfig,
  SortHelpers,
  SortConfig,
  SortDirection,
  TableLoadingConfig,
  TableErrorConfig
} from './'

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
 * Configuration for useTableSelection hook
 */
export interface UseTableSelectionConfig<T> extends SelectionConfig<T> {
  /** Table data for selection operations */
  data: T[]
}

/**
 * Configuration for useTableSorting hook
 */
export interface UseTableSortingConfig<T> extends SortingConfig<T> {
  /** Table data to sort */
  data: T[]
  /** Controlled sort state */
  sortBy?: SortConfig[]
  /** Sort change callback */
  onSortChange?: (sortConfigs: SortConfig[]) => void
}

/**
 * Return type for useTableSorting hook
 */
export interface UseTableSortingReturn<T> extends SortHelpers {
  /** Sorted data */
  sortedData: T[]
  /** Whether sorting is enabled */
  sortingEnabled: boolean
}

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
    selection?: SelectionState<T>
    /** Sorting state */
    sorting?: SortHelpers
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
      sortBy: (columnKey: string, direction?: SortDirection) => void
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
 * Minimal selection state for external consumers
 */
export interface MinimalSelectionState<T> {
  selectedItems: T[]
  selectedCount: number
  hasSelection: boolean
}
