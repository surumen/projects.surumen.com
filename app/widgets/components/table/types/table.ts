// app/widgets/components/table/types/table.ts
// Core DataTable types

import type { ReactNode } from 'react'
import type { ColumnConfig } from './columns'
import type { SelectionState, SelectionConfig } from './selection'
import type { SortConfig, SortHelpers, SortingConfig } from './sorting'

/**
 * Main DataTable component props
 */
export interface DataTableProps<T = any> {
  /** Table data array */
  data: T[]
  /** Key to identify rows */
  keyBy?: keyof T | ((row: T) => string | number)
  /** Loading state */
  loading?: boolean
  /** Additional CSS classes */
  className?: string
  /** Table HTML id attribute */
  id?: string
  /** Table role attribute (e.g., 'grid') */
  role?: string
  /** Children components (DataTable.Column, LoadingState, EmptyState) */
  children: ReactNode
  /** Selection configuration */
  selection?: SelectionConfig<T>
  /** Sorting configuration */
  sorting?: SortingConfig<T>
}

// Table styling variants - kept for future features
// export type TableVariant = 'default' | 'borderless' | 'hover' | 'striped'

// Table size options - kept for future features  
// export type TableSize = 'sm' | 'md' | 'lg'

/**
 * Generic row data type
 */
export interface TableRow {
  [key: string]: any
}

// Table context value passed to child components
// @deprecated - Not used in new children extraction approach, kept for future features
// export interface DataTableContextValue<T = any> {
//   data: T[]
//   getRowKey: (row: T, index?: number) => string | number
//   columns: ColumnConfig<T>[]
//   registerColumn: (column: ColumnConfig<T>) => void
//   unregisterColumn: (key: string) => void
//   selection?: SelectionState<T>
//   sorting?: SortHelpers
//   loading: boolean
//   onSort?: (config: SortConfig) => void
//   onRowClick?: (row: T, index: number) => void
//   onRowDoubleClick?: (row: T, index: number) => void
// }

/**
 * Table loading configuration
 */
export interface TableLoadingConfig {
  /** Whether table is loading */
  isLoading: boolean
  /** Number of skeleton rows */
  rowCount?: number
  /** Custom loading message */
  message?: string
}

/**
 * Table empty state configuration
 */
export interface TableEmptyConfig {
  /** Whether to show empty state */
  show: boolean
  /** Empty state message */
  message?: string
  /** Empty state icon */
  icon?: string
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Table error state configuration
 */
export interface TableErrorConfig {
  /** Whether there's an error */
  hasError: boolean
  /** Error message */
  message?: string
  /** Retry function */
  onRetry?: () => void
}
