// app/widgets/tables/cellRenderers/TextCell.tsx
// Basic text cell renderer

import React from 'react';
import type { TableCellProps } from '@/types';

const TextCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  if (value === null || value === undefined) {
    return <span className="text-muted">—</span>;
  }

  return (
    <span className={column.className}>
      {String(value)}
    </span>
  );
};

export default TextCell;
