// app/widgets/tables/SmartTable.tsx
// Main SmartTable component

import React from 'react';
import type { SmartTableProps } from '@/types';
import TableRow from './TableRow';

const SmartTable: React.FC<SmartTableProps> = ({
  data,
  columns,
  styling = {},
  selection,
  onRowClick,
  onRowDoubleClick,
  loading,
  emptyState,
  className = '',
  id
}) => {
  // Build table classes
  const tableClasses = [
    'table',
    styling.theme === 'borderless' ? 'table-borderless' : '',
    styling.theme === 'hover' ? 'table-hover' : '',
    styling.theme === 'striped' ? 'table-striped' : '',
    'table-thead-bordered',
    styling.nowrap ? 'table-nowrap' : '',
    styling.textAlign ? `table-text-${styling.textAlign}` : '',
    styling.verticalAlign ? `table-align-${styling.verticalAlign}` : 'table-align-middle',
    styling.size ? `table-${styling.size}` : '',
    styling.className
  ].filter(Boolean).join(' ');

  // Filter visible columns
  const visibleColumns = columns.filter(col => col.visible !== false);

  // Handle select all for selection
  const handleSelectAll = () => {
    if (!selection || selection.mode === 'none') return;

    const allSelected = data.length > 0 && data.every(row => 
      selection.selectedRows.some(selected => {
        if (selection.selectRowsBy) {
          return selected[selection.selectRowsBy] === row[selection.selectRowsBy];
        }
        return selected === row;
      })
    );

    if (allSelected) {
      selection.onSelectionChange([]);
    } else {
      selection.onSelectionChange([...data]);
    }
  };

  const isAllSelected = selection && data.length > 0 && data.every(row => 
    selection.selectedRows.some(selected => {
      if (selection.selectRowsBy) {
        return selected[selection.selectRowsBy] === row[selection.selectRowsBy];
      }
      return selected === row;
    })
  );

  // Loading skeleton rows
  const renderLoadingSkeleton = () => {
    const rowCount = loading?.rowCount || 5;
    return Array.from({ length: rowCount }, (_, index) => (
      <tr key={`loading-${index}`}>
        {selection && selection.mode !== 'none' && (
          <td className="table-column-pe-0">
            <div className="placeholder-glow">
              <span className="placeholder placeholder-sm bg-light rounded"></span>
            </div>
          </td>
        )}
        {visibleColumns.map((column) => (
          <td key={column.key}>
            <div className="placeholder-glow">
              <span className="placeholder col-8 bg-light"></span>
            </div>
          </td>
        ))}
      </tr>
    ));
  };

  // Empty state
  const renderEmptyState = () => (
    <tr>
      <td colSpan={visibleColumns.length + (selection?.mode !== 'none' ? 1 : 0)} className="text-center py-4">
        {emptyState?.icon && (
          <i className={`bi-${emptyState.icon} fs-1 text-muted mb-3 d-block`}></i>
        )}
        <div className="text-muted mb-3">
          {emptyState?.message || 'No data available'}
        </div>
        {emptyState?.action && (
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={emptyState.action.onClick}
          >
            {emptyState.action.label}
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className={`table-responsive ${className}`}>
      <table className={tableClasses} id={id}>
        <thead className={styling.headerLight !== false ? 'thead-light' : ''}>
          <tr>
            {/* Selection header */}
            {selection && selection.mode === 'multiple' && (
              <th className="table-column-pe-0">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllSelected || false}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label"></label>
                </div>
              </th>
            )}
            {selection && selection.mode === 'single' && (
              <th className="table-column-pe-0" style={{ width: '24px' }}></th>
            )}

            {/* Column headers */}
            {visibleColumns.map((column) => (
              <th 
                key={column.key}
                className={column.className}
                style={{ width: column.width, minWidth: column.minWidth }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading?.show ? (
            renderLoadingSkeleton()
          ) : data.length === 0 ? (
            emptyState?.show !== false && renderEmptyState()
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                row={row}
                index={index}
                columns={visibleColumns}
                selection={selection}
                onRowClick={onRowClick}
                onRowDoubleClick={onRowDoubleClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SmartTable;
