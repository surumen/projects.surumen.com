// app/widgets/tables/cellRenderers/TechnologiesBadgeCell.tsx
// Technologies badge cell renderer with accent colors and legend indicators

import React from 'react';
import type { TableCellProps } from '@/types';
import { getTechnologyScheme } from '@/utils';

interface TechnologiesBadgeCellProps extends TableCellProps {
  maxVisible?: number; // Maximum number of technologies to show
  showMoreText?: boolean; // Show "+X more" for remaining technologies
}

// Map accent colors to closest Bootstrap soft colors for better visual consistency
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

const TechnologiesBadgeCell: React.FC<TechnologiesBadgeCellProps> = ({ 
  value, 
  row, 
  column,
  maxVisible = 2,
  showMoreText = true 
}) => {
  // Value should be an array of technology strings
  const technologies: string[] = Array.isArray(value) ? value : [];
  
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
            className={`badge bg-soft-${softColor} text-${softColor}`}
          >
            <span className={`legend-indicator bg-accent-${accentColor} me-1`}></span>
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
};

export default TechnologiesBadgeCell;
