// app/widgets/tables/TableRow.tsx
// Individual table row component

import React from 'react';
import type { TableRowProps } from '@/types';
import TableCell from './TableCell';

const TableRow: React.FC<TableRowProps> = ({ 
  row, 
  index, 
  columns, 
  selection, 
  onRowClick, 
  onRowDoubleClick 
}) => {
  // Handle row selection
  const isSelected = selection?.selectedRows.some(selected => {
    if (selection.selectRowsBy) {
      return selected[selection.selectRowsBy] === row[selection.selectRowsBy];
    }
    return selected === row;
  });

  const handleSelectionChange = () => {
    if (!selection || selection.mode === 'none') return;

    const currentSelected = [...selection.selectedRows];
    
    if (isSelected) {
      // Remove from selection
      const newSelected = currentSelected.filter(selected => {
        if (selection.selectRowsBy) {
          return selected[selection.selectRowsBy] !== row[selection.selectRowsBy];
        }
        return selected !== row;
      });
      selection.onSelectionChange(newSelected);
    } else {
      // Add to selection
      if (selection.mode === 'single') {
        selection.onSelectionChange([row]);
      } else {
        selection.onSelectionChange([...currentSelected, row]);
      }
    }
  };

  // Filter visible columns
  const visibleColumns = columns.filter(col => col.visible !== false);

  return (
    <tr 
      className={onRowClick ? 'cursor-pointer' : ''}
      onClick={() => onRowClick?.(row, index)}
      onDoubleClick={() => onRowDoubleClick?.(row, index)}
    >
      {/* Selection checkbox */}
      {selection && selection.mode !== 'none' && (
        <td className="table-column-pe-0">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSelected}
              onChange={handleSelectionChange}
              onClick={(e) => e.stopPropagation()} // Prevent row click
            />
            <label className="form-check-label"></label>
          </div>
        </td>
      )}

      {/* Data cells */}
      {visibleColumns.map((column) => (
        <TableCell
          key={column.key}
          value={row[column.key]}
          row={row}
          column={column}
        />
      ))}
    </tr>
  );
};

export default TableRow;
