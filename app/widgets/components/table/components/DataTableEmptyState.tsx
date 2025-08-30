// app/widgets/components/table/components/DataTableEmptyState.tsx
// Empty state marker component

"use client"

import React from 'react'
import type { DataTableEmptyStateProps } from '../types'

/**
 * DataTable Empty State marker component
 * This component doesn't render anything - it's just used to define empty state configuration
 * The DataTable component extracts its props during children traversal
 */
const DataTableEmptyState: React.FC<DataTableEmptyStateProps> = (_props) => {
  return null
}

export default DataTableEmptyState