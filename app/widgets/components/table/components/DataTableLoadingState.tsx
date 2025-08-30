// app/widgets/components/table/components/DataTableLoadingState.tsx
// Loading state marker component

"use client"

import React from 'react'
import type { DataTableLoadingStateProps } from '../types'

/**
 * DataTable Loading State marker component
 * This component doesn't render anything - it's just used to define loading configuration
 * The DataTable component extracts its props during children traversal
 */
const DataTableLoadingState: React.FC<DataTableLoadingStateProps> = (_props) => {
  return null
}

export default DataTableLoadingState