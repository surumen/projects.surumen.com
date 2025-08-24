// app/widgets/tables/cellRenderers/CustomCell.tsx
// Custom cell renderer wrapper

import React from 'react';
import type { TableCellProps } from '@/types';

const CustomCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  if (!column.customConfig?.render) {
    return <span className="text-muted">—</span>;
  }

  return (
    <>
      {column.customConfig.render(value, row, column.key)}
    </>
  );
};

export default CustomCell;
