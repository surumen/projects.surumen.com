// app/widgets/components/table/types/sorting.ts
// Sorting configuration and state types

/**
 * Sort direction options
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort configuration for a single column
 */
export interface SortConfig {
  /** Column key to sort by */
  key: string
  /** Sort direction */
  direction: SortDirection
  /** Sort priority for multi-column sorting */
  priority?: number
}

/**
 * Sorting state and configuration
 */
export interface SortState {
  /** Current sort configuration(s) */
  sortBy: SortConfig[]
  /** Whether multi-column sorting is enabled */
  multiSort?: boolean
  /** Default sort configuration */
  defaultSort?: SortConfig | SortConfig[]
}

/**
 * Sorting configuration for useTableSorting hook
 */
export interface SortingConfig<T = any> {
  /** Whether sorting is enabled */
  enabled?: boolean
  /** Whether multi-column sorting is allowed */
  multiSort?: boolean
  /** Default sort configuration */
  defaultSort?: SortConfig | SortConfig[]
  /** Custom sort functions for specific columns */
  customSorters?: Record<string, SortFunction<T>>
  /** Whether to preserve sort state */
  preserveSort?: boolean
}

/**
 * Custom sort function type
 */
export type SortFunction<T = any> = (a: T, b: T, direction: SortDirection) => number

/**
 * Sort helper functions returned by useTableSorting
 */
export interface SortHelpers {
  /** Current sort state */
  sortState: SortState
  /** Sort by a column */
  sortBy: (columnKey: string, direction?: SortDirection) => void
  /** Add sort to multi-sort */
  addSort: (columnKey: string, direction: SortDirection) => void
  /** Remove sort for a column */
  removeSort: (columnKey: string) => void
  /** Clear all sorting */
  clearSort: () => void
  /** Toggle sort for a column */
  toggleSort: (columnKey: string) => void
  /** Get sort direction for a column */
  getSortDirection: (columnKey: string) => SortDirection | null
  /** Check if a column is sorted */
  isSorted: (columnKey: string) => boolean
  /** Get sort priority for a column */
  getSortPriority: (columnKey: string) => number | null
  /** Get props for sort button */
  getSortProps: (columnKey: string) => SortProps
}

/**
 * Props for sortable column headers
 */
export interface SortProps {
  /** Whether column is currently sorted */
  isSorted: boolean
  /** Current sort direction */
  direction: SortDirection | null
  /** Sort priority (for multi-sort) */
  priority: number | null
  /** Click handler to toggle sort */
  onClick: () => void
  /** ARIA attributes for accessibility */
  'aria-label': string
  'aria-sort': 'ascending' | 'descending' | 'none'
}

/**
 * Sort indicator component props
 */
export interface SortIndicatorProps {
  /** Current sort direction */
  direction: SortDirection | null
  /** Whether column is sorted */
  isSorted: boolean
  /** Sort priority for multi-sort */
  priority?: number | null
  /** Custom CSS classes */
  className?: string
}

/**
 * Sortable column header props
 */
export interface SortableHeaderProps {
  /** Column header text */
  children: React.ReactNode
  /** Column key for sorting */
  sortKey: string
  /** Whether column is sortable */
  sortable?: boolean
  /** Custom CSS classes */
  className?: string
  /** Sort direction */
  direction?: SortDirection | null
  /** Sort priority */
  priority?: number | null
  /** Click handler */
  onClick?: () => void
}
