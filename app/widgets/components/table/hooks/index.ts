// app/widgets/components/table/hooks/index.ts
// Barrel export for DataTable hooks

// Core hooks
export { useDataTable } from './useDataTable'
export { useTableData } from './useTableData'
export { useTableSelection } from './useTableSelection'
export { useTableSorting } from './useTableSorting'
export { useTableSelectionState } from './useTableSelectionState'
// export { useDataTableContext } from './useDataTableContext' // Removed - no longer needed

// Hook types - re-export from main types
export type { 
  UseDataTableConfig, 
  UseDataTableReturn,
  UseTableDataConfig,
  UseTableDataReturn,
  UseTableSelectionConfig,
  UseTableSortingConfig,
  UseTableSortingReturn,
  MinimalSelectionState
} from '../types/hooks'
