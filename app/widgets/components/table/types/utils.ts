// app/widgets/components/table/types/utils.ts
// Utility types for table helpers

import { ReactNode } from 'react'
import type { ColumnConfig } from './columns'

/**
 * Result of extracting table children components
 */
export interface ChildExtractionResult<T> {
  columns: ColumnConfig<T>[]
  loadingState: {
    show: boolean
    rowCount: number
    children?: ReactNode
  } | null
  emptyState: {
    show: boolean
    children?: ReactNode
  } | null
}

/**
 * Component types for identification during extraction
 */
export interface ComponentTypes {
  Column: any
  LoadingState: any
  EmptyState: any
}
