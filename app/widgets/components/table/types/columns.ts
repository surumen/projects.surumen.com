// app/widgets/components/table/types/columns.ts
// Column configuration types

import { ReactNode } from 'react'
import type { SelectionState } from './selection'
import type { SortConfig } from './sorting'

/**
 * Column configuration for DataTable
 */
export interface ColumnConfig<T = any> {
  /** Unique column key */
  key: string
  /** Column index for ordering */
  index: number
  /** Cell render function */
  render?: (context: CellRenderContext<T>) => ReactNode
  /** Header render function */
  headerRender?: (context: HeaderRenderContext<T>) => ReactNode
  /** Column header props */
  headerProps?: ColumnHeaderProps<T>
  /** Whether column is visible */
  visible?: boolean
}

/**
 * Column header properties
 */
export interface ColumnHeaderProps<T = any> {
  /** Column header text */
  header?: ReactNode
  /** Text alignment */
  align?: ColumnAlign
  /** Column width */
  width?: string | number
  /** Minimum column width */
  minWidth?: string | number
  /** Maximum column width */
  maxWidth?: string | number
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is sticky */
  sticky?: boolean
  /** Additional CSS classes */
  className?: string
  /** Column data key for sorting - must be a valid key of T */
  sortKey?: keyof T
}

/**
 * Text alignment options
 */
export type ColumnAlign = 'start' | 'center' | 'end'

/**
 * Context provided to cell render functions
 */
export interface CellRenderContext<T = any> {
  /** Row data */
  row: T
  /** Row index */
  index: number
  /** Cell value for this column */
  value: any
  /** Selection state helpers */
  selection?: SelectionHelpers<T>
  /** Whether this row is selected */
  isSelected: boolean
}

/**
 * Context provided to header render functions
 */
export interface HeaderRenderContext<T = any> {
  /** All table data */
  data: T[]
  /** Selection state helpers */
  selection?: SelectionHelpers<T>
  /** Current sort configuration */
  sorting?: SortConfig
  /** Column configuration */
  column: ColumnConfig<T>
}

/**
 * Selection helpers passed to render contexts
 */
export interface SelectionHelpers<T = any> {
  /** Whether all items are selected */
  isAllSelected: boolean
  /** Whether some items are selected */
  isSomeSelected: boolean
  /** Currently selected items */
  selectedItems: T[]
  /** Number of selected items */
  selectedCount: number
  /** Whether any items are selected */
  hasSelected: boolean
  /** Check if specific item is selected */
  isSelected: (item: T) => boolean
  /** Toggle selection for specific item */
  toggleItem: (item: T) => void
  /** Select all items */
  selectAll: () => void
  /** Clear all selections */
  clearSelection: () => void
  /** Toggle all selection */
  toggleAll: () => void
  /** Get props for select-all checkbox */
  getSelectAllProps: () => CheckboxProps
  /** Get props for item checkbox */
  getItemProps: (item: T) => CheckboxProps
}

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * DataTable.Header component props
 */
export interface DataTableHeaderProps {
  /** Additional CSS classes */
  className?: string
  /** Whether to use light header styling */
  light?: boolean
  /** Children components (columns) */
  children: ReactNode
}

/**
 * DataTable.Body component props
 */
export interface DataTableBodyProps {
  /** Additional CSS classes */
  className?: string
  /** Children components (loading/empty states) */
  children?: ReactNode
}

/**
 * DataTable.LoadingState component props
 */
export interface DataTableLoadingStateProps {
  /** Whether to show loading state */
  show: boolean
  /** Number of skeleton rows to render */
  rowCount?: number
  /** Custom loading content */
  children?: ReactNode
}

/**
 * DataTable.EmptyState component props
 */
export interface DataTableEmptyStateProps {
  /** Whether to show empty state */
  show: boolean
  /** Custom empty state content */
  children?: ReactNode
}

/**
 * DataTable.Column component props
 */
export interface DataTableColumnProps<T = any> {
  /** Unique column key */
  key?: string
  /** Column header content */
  header?: ReactNode
  /** Text alignment */
  align?: ColumnAlign
  /** Column width */
  width?: string | number
  /** Minimum column width */
  minWidth?: string | number
  /** Maximum column width */
  maxWidth?: string | number
  /** Whether column is sortable */
  sortable?: boolean
  /** Whether column is sticky */
  sticky?: boolean
  /** Additional CSS classes */
  className?: string
  /** Data key for sorting - must be a valid key of T */
  sortKey?: keyof T
  /** Whether column is visible */
  visible?: boolean
  /** Render function for both header and cell content */
  children?: (context: CellRenderContext<T>) => ReactNode
  /** Header-specific render function */
  headerRender?: (context: HeaderRenderContext<T>) => ReactNode
}
