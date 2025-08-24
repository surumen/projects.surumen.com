// app/widgets/tables/cellRenderers/BadgeCell.tsx
// Badge/status cell renderer with technologies support

import React from 'react';
import type { TableCellProps } from '@/types';
import { getTechnologyScheme } from '@/utils';

// Map accent colors to closest Bootstrap soft colors
const accentToSoftColorMap: Record<string, string> = {
  ocean: 'info',
  crimson: 'danger', 
  rust: 'warning',
  canopy: 'success',
  navy: 'primary',
  plum: 'secondary',
  magenta: 'danger',
  gold: 'warning',
  zen: 'success',
  sunset: 'warning',
  tangerine: 'warning',
  lime: 'success',
  cloud: 'light',
  orchid: 'info',
  pink: 'danger',
  banana: 'warning',
  coconut: 'light',
  graphite: 'dark'
};

const BadgeCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  if (!value) {
    return <span className="text-muted">—</span>;
  }

  const config = column.badgeConfig || {};

  // Handle array of technologies (merged from TechnologiesBadgeCell)
  if (Array.isArray(value)) {
    const technologies: string[] = value;
    const maxVisible = config.maxVisible || 4;
    const showMoreText = config.showMoreText !== false;
    
    if (technologies.length === 0) {
      return <span className="text-muted">—</span>;
    }

    const visibleTechs = technologies.slice(0, maxVisible);
    const remainingCount = technologies.length - maxVisible;

    return (
      <div className="d-flex flex-wrap gap-1">
        {visibleTechs.map((tech: string) => {
          const accentColor = getTechnologyScheme(tech);
          const softColor = accentToSoftColorMap[accentColor] || 'secondary';
          
          return (
            <span 
              key={tech} 
              className={`badge bg-soft-${accentColor} text-${accentColor}`}
            >
              <span className={`legend-indicator bg-${accentColor} me-1`}></span>
              {tech}
            </span>
          );
        })}
        
        {remainingCount > 0 && showMoreText && (
          <span className="badge bg-light text-dark small">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  }

  // Handle single value (original BadgeCell functionality)
  const valueStr = String(value).toLowerCase();
  
  // Default color mapping for statuses
  const defaultColorMap = {
    active: 'success',
    success: 'success',
    paid: 'success',
    completed: 'success',
    fulfilled: 'info',
    pending: 'warning',
    warning: 'warning',
    failed: 'danger',
    danger: 'danger',
    error: 'danger',
    suspended: 'danger',
    cancelled: 'danger',
    unfulfilled: 'dark',
    inactive: 'secondary'
  };

  let softVariant = 'secondary';
  let indicatorColor = 'secondary';

  // Check if using custom color function
  if (config.colorFunction) {
    const accentColor = config.colorFunction(String(value));
    softVariant = accentToSoftColorMap[accentColor] || 'secondary';
    indicatorColor = accentColor;
  } 
  // Use color map if provided
  else if (config.colorMap) {
    const variant = config.colorMap[valueStr] || 'secondary';
    softVariant = variant;
    indicatorColor = variant;
  }
  // Fall back to default status colors
  else {
    const variant = defaultColorMap[valueStr] || 'secondary';
    softVariant = variant;
    indicatorColor = variant;
  }

  // Build CSS classes
  const badgeClasses = [
    'badge',
    `bg-soft-${softVariant}`,
    `text-${softVariant}`,
    config.className
  ].filter(Boolean).join(' ');

  // Determine indicator class
  const indicatorClasses = config.colorFunction 
    ? `legend-indicator bg-accent-${indicatorColor}` 
    : `legend-indicator bg-${indicatorColor}`;

  return (
    <span className={badgeClasses}>
      {config.showIndicator !== false && (
        <span className={`${indicatorClasses} me-1`}></span>
      )}
      {String(value)}
    </span>
  );
};

export default BadgeCell;
