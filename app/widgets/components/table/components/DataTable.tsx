// app/widgets/components/table/components/DataTable.tsx
// Main DataTable component with children extraction approach

"use client"

import React, { useMemo } from 'react'
import type { DataTableProps } from '../types'
import DataTableColumn from './DataTableColumn'
import DataTableLoadingState from './DataTableLoadingState'
import DataTableEmptyState from './DataTableEmptyState'
import { extractTableChildren } from '../utils/childrenExtraction'

const DataTable = <T,>({
  data,
  keyBy = 'id' as keyof T,
  loading = false,
  className = '',
  id,
  role,
  children
}: DataTableProps<T>) => {
  // Extract key function
  const getRowKey = useMemo(() => {
    if (typeof keyBy === 'function') {
      return keyBy
    }
    return (row: T, index?: number): string | number => {
      if (row && typeof row === 'object' && keyBy in row) {
        const key = (row as any)[keyBy]
        if (key != null) return key
      }
      return index ?? Math.random().toString(36).substring(2, 9)
    }
  }, [keyBy])

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

          const headerClasses = [
            column.headerProps?.align && column.headerProps.align !== 'start' 
              ? `text-${column.headerProps.align === 'end' ? 'end' : column.headerProps.align}` 
              : '',
            column.headerProps?.sticky ? 'sticky-column' : '',
            column.headerProps?.className || ''
          ].filter(Boolean).join(' ')

          return (
            <th key={column.key} className={headerClasses} style={style}>
              {typeof column.headerProps?.header === 'function' 
                ? (column.headerProps.header as () => React.ReactNode)()
                : column.headerProps?.header
              }
            </th>
          )
        })}
      </tr>
    </thead>
  )

  // Render table body with data rows
  const renderBody = () => (
    <tbody>
      {data.map((row, rowIndex) => {
        const rowKey = getRowKey(row, rowIndex)
        return (
          <tr key={rowKey}>
            {columns.map((column) => {
              const cellValue = column.headerProps?.sortKey 
                ? (row as any)[column.headerProps.sortKey] 
                : null
              
              const cellContext = {
                row,
                index: rowIndex,
                value: cellValue,
                isSelected: false, // Simplified for now
                selection: undefined // Will be added in future phases
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
      <table className={`table ${className}`} id={id} role={role}>
        {tableChildren}
      </table>
    </div>
  )

  // Render loading state if active
  if (loading && loadingState?.show) {
    return (
      <TableWrapper>
        {renderHeader()}
        {renderLoadingBody(loadingState.rowCount)}
      </TableWrapper>
    )
  }

  // Render empty state if no data and empty state is configured
  if (!loading && data.length === 0 && emptyState?.show) {
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
