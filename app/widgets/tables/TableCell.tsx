// app/widgets/tables/TableCell.tsx
// Individual table cell component

import React from 'react';
import type { TableCellProps } from '@/types';
import { CELL_RENDERERS } from './cellRenderers';

const TableCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  // Get the appropriate renderer
  const RendererComponent = CELL_RENDERERS[column.renderer] || CELL_RENDERERS.text;
  
  // Build cell classes
  const cellClasses = [
    column.align ? `text-${column.align === 'right' ? 'end' : column.align}` : '',
    column.className
  ].filter(Boolean).join(' ');

  return (
    <td className={cellClasses} style={{ width: column.width, minWidth: column.minWidth }}>
      <RendererComponent value={value} row={row} column={column} />
    </td>
  );
};

export default TableCell;
