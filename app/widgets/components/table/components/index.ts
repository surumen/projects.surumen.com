// app/widgets/components/table/components/index.ts
// Barrel export for DataTable components

import DataTable from './DataTable'
import DataTableColumn from './DataTableColumn'
import DataTableLoadingState from './DataTableLoadingState'
import DataTableEmptyState from './DataTableEmptyState'

// Create compound component pattern
const DataTableWithSubComponents = DataTable as typeof DataTable & {
  Column: typeof DataTableColumn
  LoadingState: typeof DataTableLoadingState
  EmptyState: typeof DataTableEmptyState
}

// Attach sub-components
DataTableWithSubComponents.Column = DataTableColumn
DataTableWithSubComponents.LoadingState = DataTableLoadingState
DataTableWithSubComponents.EmptyState = DataTableEmptyState

// Export compound component as both named and default
export { DataTableWithSubComponents as DataTable }
export default DataTableWithSubComponents

// Named exports for direct imports if needed
export {
  DataTableColumn,
  DataTableLoadingState,
  DataTableEmptyState
}
