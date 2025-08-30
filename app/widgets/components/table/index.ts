// app/widgets/components/table/index.ts

// types
export type * from './types'

// main components (compound component pattern)
export { DataTable } from './components'
export { default } from './components'

// hooks (main composite hook + individual hooks for advanced usage)
export { useDataTable, useTableData, useTableSelection, useTableSorting } from './hooks'
export type { UseDataTableConfig, UseDataTableReturn } from './hooks'

// utilities (for custom implementations)
export * from './utils'
