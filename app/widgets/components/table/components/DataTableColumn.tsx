// app/widgets/components/table/components/DataTableColumn.tsx  
// Column definition component - now a simple marker component

"use client"

import React from 'react'
import type { DataTableColumnProps } from '../types'

/**
 * DataTable Column marker component
 * This component doesn't render anything - it's just used to define column configuration
 * The DataTable component extracts its props during children traversal
 */
const DataTableColumn = <T,>(_props: DataTableColumnProps<T>) => {
  return null
}

export default DataTableColumn
