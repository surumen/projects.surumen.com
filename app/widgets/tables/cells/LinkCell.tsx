// app/widgets/tables/cellRenderers/LinkCell.tsx
// Link cell renderer with pattern support

import React from 'react';
import Link from 'next/link';
import type { TableCellProps } from '@/types';

const LinkCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  if (!column.linkConfig || !value) {
    return <span className="text-muted">—</span>;
  }

  // Replace pattern placeholders with actual values
  const href = column.linkConfig.linkPattern.replace(
    /\{([^}]+)\}/g, 
    (match, key) => row[key] || value
  );

  const className = `${column.linkConfig.className || ''} ${column.className || ''}`.trim();

  // Handle external links
  if (href.startsWith('http')) {
    return (
      <a 
        href={href}
        className={className}
        target={column.linkConfig.target || '_blank'}
        rel="noopener noreferrer"
      >
        {String(value)}
      </a>
    );
  }

  // Handle internal Next.js links
  return (
    <Link 
      href={href}
      className={className}
      target={column.linkConfig.target}
    >
      {String(value)}
    </Link>
  );
};

export default LinkCell;
