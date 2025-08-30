// app/widgets/components/table/types/pagination.ts
// Pagination configuration and state types

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Whether pagination is enabled */
  enabled?: boolean
  /** Current page (1-based) */
  currentPage?: number
  /** Items per page */
  pageSize?: number
  /** Total number of items */
  totalItems?: number
  /** Available page size options */
  pageSizeOptions?: number[]
  /** Whether to show page size selector */
  showPageSizeSelector?: boolean
  /** Whether to show pagination info */
  showInfo?: boolean
  /** Server-side pagination */
  serverSide?: boolean
  /** Page change callback */
  onPageChange?: (page: number) => void
  /** Page size change callback */
  onPageSizeChange?: (pageSize: number) => void
}

/**
 * Pagination state returned by useTablePagination
 */
export interface PaginationState {
  /** Current page (1-based) */
  currentPage: number
  /** Items per page */
  pageSize: number
  /** Total number of items */
  totalItems: number
  /** Total number of pages */
  totalPages: number
  /** Whether there's a previous page */
  hasPreviousPage: boolean
  /** Whether there's a next page */
  hasNextPage: boolean
  /** Start index of current page items (0-based) */
  startIndex: number
  /** End index of current page items (0-based) */
  endIndex: number
  /** Current page data */
  currentPageData: any[]
  
  /** Pagination actions */
  goToPage: (page: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  setPageSize: (size: number) => void
  
  /** Props for pagination components */
  getPaginationProps: () => PaginationProps
  getPageSizeProps: () => PageSizeProps
  getInfoProps: () => PaginationInfoProps
}

/**
 * Props for pagination component
 */
export interface PaginationProps {
  /** Current page */
  currentPage: number
  /** Total pages */
  totalPages: number
  /** Whether there's previous page */
  hasPreviousPage: boolean
  /** Whether there's next page */
  hasNextPage: boolean
  /** Go to specific page */
  onPageChange: (page: number) => void
  /** Go to previous page */
  onPreviousPage: () => void
  /** Go to next page */
  onNextPage: () => void
  /** Maximum number of page buttons to show */
  maxPageButtons?: number
  /** Custom CSS classes */
  className?: string
}

/**
 * Props for page size selector
 */
export interface PageSizeProps {
  /** Current page size */
  pageSize: number
  /** Available page size options */
  options: number[]
  /** Page size change handler */
  onChange: (size: number) => void
  /** Custom CSS classes */
  className?: string
}

/**
 * Props for pagination info component
 */
export interface PaginationInfoProps {
  /** Start index of current page */
  startIndex: number
  /** End index of current page */
  endIndex: number
  /** Total number of items */
  totalItems: number
  /** Current page */
  currentPage: number
  /** Total pages */
  totalPages: number
  /** Custom CSS classes */
  className?: string
}
