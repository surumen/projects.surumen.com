// app/widgets/components/table/components/DataTable.tsx
// Main DataTable component with children extraction approach

"use client"

import React, { useMemo } from 'react'
import type { 
  DataTableProps, 
  CellRenderContext,
  HeaderRenderContext,
  SortDirection
} from '../types'
import { useTableData, useTableSelection, useTableSorting } from '../hooks'
import DataTableColumn from './DataTableColumn'
import DataTableLoadingState from './DataTableLoadingState'
import DataTableEmptyState from './DataTableEmptyState'
import { extractTableChildren } from '../utils/childrenExtraction'

// Helper function to get sort CSS class
const getSortClass = (sortable: boolean, direction: SortDirection | null): string => {
  if (!sortable) return ''
  if (direction === 'asc') return 'sorting_asc'
  if (direction === 'desc') return 'sorting_desc'
  return 'sorting'
}

// Extended props to include selection and sorting configurations
const DataTable = <T,>({
  data,
  keyBy = 'id' as keyof T,
  loading = false,
  className = '',
  id,
  role,
  children,
  selection,
  sorting
}: DataTableProps<T>) => {
  // Initialize hooks
  const dataHook = useTableData({ 
    data, 
    keyBy, 
    loading 
  })

  const sortingHook = useTableSorting({
    data: dataHook.data,
    ...sorting
  })

  const selectionHook = useTableSelection({
    data: sortingHook.sortedData,
    mode: selection?.mode || 'none',
    keyBy: selection?.keyBy || keyBy,
    ...selection
  })

  // Use processed data from hooks
  const processedData = sortingHook.sortedData
  const getRowKey = dataHook.getRowKey

  // Extract children components
  const { columns, loadingState, emptyState } = useMemo(
    () => extractTableChildren<T>(children, {
      Column: DataTableColumn,
      LoadingState: DataTableLoadingState,
      EmptyState: DataTableEmptyState
    }),
    [children]
  )

  // Render table header
  const renderHeader = () => (
    <thead>
      <tr>
        {columns.map((column) => {
          const style = {
            width: column.headerProps?.width,
            minWidth: column.headerProps?.minWidth,
            maxWidth: column.headerProps?.maxWidth
          }

          // Get sort props if sortable
          const sortProps = column.headerProps?.sortable && sortingHook.sortingEnabled 
            ? sortingHook.getSortProps(column.key) 
            : undefined

          // Build header classes including sort state
          const headerClasses = [
            column.headerProps?.align && column.headerProps.align !== 'start' 
              ? `text-${column.headerProps.align === 'end' ? 'end' : column.headerProps.align}` 
              : '',
            column.headerProps?.sticky ? 'sticky-column' : '',
            column.headerProps?.className || '',
            getSortClass(!!column.headerProps?.sortable && sortingHook.sortingEnabled, sortProps?.direction ?? null)
          ].filter(Boolean).join(' ')

          // Create header render context
          const headerContext: HeaderRenderContext<T> = {
            data: processedData,
            selection: selection?.mode !== 'none' ? {
              getSelectAllProps: selectionHook.getSelectAllProps
            } : undefined,
            sorting: sortProps,
            column
          }

          // Determine what to render in header
          let headerContent: React.ReactNode
          
          if (column.headerRender) {
            // Custom header render function
            headerContent = column.headerRender(headerContext)
          } else {
            // Use header prop directly (no button wrapper needed)
            headerContent = typeof column.headerProps?.header === 'function' 
              ? (column.headerProps.header as () => React.ReactNode)()
              : column.headerProps?.header
          }

          return (
            <th 
              key={column.key} 
              className={headerClasses} 
              style={style}
              onClick={sortProps?.onClick}
              role={sortProps ? 'button' : undefined}
              tabIndex={sortProps ? 0 : undefined}
              aria-label={sortProps?.['aria-label']}
              onKeyDown={sortProps ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  sortProps.onClick()
                }
              } : undefined}
            >
              {headerContent}
            </th>
          )
        })}
      </tr>
    </thead>
  )

  // Render table body with data rows
  const renderBody = () => (
    <tbody>
      {processedData.map((row, rowIndex) => {
        const rowKey = getRowKey(row, rowIndex)
        const isRowSelected = selection?.mode !== 'none' ? selectionHook.isSelected(row) : false
        
        return (
          <tr key={rowKey} className={isRowSelected ? 'table-active' : ''}>
            {columns.map((column) => {
              const cellValue = column.headerProps?.sortKey 
                ? (row as any)[column.headerProps.sortKey] 
                : null
              
              const cellContext: CellRenderContext<T> = {
                row,
                index: rowIndex,
                value: cellValue,
                isSelected: isRowSelected,
                selection: selection?.mode !== 'none' ? {
                  getItemProps: selectionHook.getItemProps
                } : undefined
              }

              const cellClasses = [
                column.headerProps?.align && column.headerProps.align !== 'start'
                  ? `text-${column.headerProps.align === 'end' ? 'end' : column.headerProps.align}`
                  : '',
                column.headerProps?.className || ''
              ].filter(Boolean).join(' ')

              const cellStyle = {
                width: column.headerProps?.width,
                minWidth: column.headerProps?.minWidth,
                maxWidth: column.headerProps?.maxWidth
              }

              return (
                <td key={`${rowKey}-${column.key}`} className={cellClasses} style={cellStyle}>
                  {column.render ? column.render(cellContext) : cellValue}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )

  // Render loading state
  const renderLoadingBody = (rowCount: number) => (
    <tbody>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <tr key={`loading-${rowIndex}`}>
          {columns.map((column, colIndex) => (
            <td key={`loading-${rowIndex}-${column.key}`} className={column.headerProps?.className || ''}>
              <div className="placeholder-glow">
                <span 
                  className={`placeholder bg-light ${
                    colIndex === 0 ? 'col-8' : 
                    colIndex === columns.length - 1 ? 'col-4' : 
                    'col-6'
                  }`}
                  style={{ height: '20px' }}
                />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )

  // Render empty state
  const renderEmptyBody = (content: React.ReactNode) => (
    <tbody>
      <tr>
        <td colSpan={columns.length} className="border-0">
          {content || (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              </div>
              <h6 className="text-muted mb-2">No data available</h6>
              <p className="text-muted mb-0 small">
                There are no items to display at the moment.
              </p>
            </div>
          )}
        </td>
      </tr>
    </tbody>
  )

  // Table wrapper component
  const TableWrapper = ({ children: tableChildren }: { children: React.ReactNode }) => (
    <div className="table-responsive">
      <table className={`table datatable-custom ${className}`} id={id} role={role}>
        {tableChildren}
      </table>
    </div>
  )

  // Render loading state if active
  if (dataHook.loading.isLoading && loadingState?.show) {
    return (
      <TableWrapper>
        {renderHeader()}
        {renderLoadingBody(loadingState.rowCount || 5)}
      </TableWrapper>
    )
  }

  // Render empty state if no data and empty state is configured
  if (!dataHook.loading.isLoading && processedData.length === 0 && emptyState?.show) {
    return (
      <TableWrapper>
        {renderHeader()}
        {renderEmptyBody(emptyState.children)}
      </TableWrapper>
    )
  }

  // Render normal table with data
  return (
    <TableWrapper>
      {renderHeader()}
      {renderBody()}
    </TableWrapper>
  )
}

export default DataTable
