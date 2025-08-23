// app/widgets/tables/cellRenderers/TextCell.tsx
// Basic text cell renderer with formatting support

import React from 'react';
import type { TableCellProps } from '@/types';
import { formatValue } from '@/utils';

const TextCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  if (value === null || value === undefined) {
    return <span className="text-muted">—</span>;
  }

  // Apply formatting if specified
  const displayValue = column.format 
    ? formatValue(value, column.format)
    : String(value);

  return (
    <span className={column.className}>
      {displayValue}
    </span>
  );
};

export default TextCell;
