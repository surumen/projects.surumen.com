import React, { useMemo } from 'react';

interface YearDisplayProps {
  startYear?: number;
  endYear?: number;
  className?: string;
}

const YearDisplay: React.FC<YearDisplayProps> = ({ 
  startYear = 2015, 
  endYear = new Date().getFullYear(),
  className = ""
}) => {
  const rotatedStyle = useMemo(
    () => ({
      display: 'inline-block',
      transform: 'rotate(270deg)',
      transformOrigin: 'center',
    }),
    []
  );

  return (
    <div className={`navbar-vertical-content ${className}`}>
      <div className="navbar-nav nav-compact h-100">
        <nav className="nav nav-pills nav-vertical align-content-center h-100 py-6 mb-4">
          <h1
            style={rotatedStyle}
            className="display-2 font-display fw-bolder text-body-secondary opacity-25 py-3 mb-0"
          >
            {endYear}
          </h1>
          <div className="nav-divider-step mt-auto"></div>
          <h1
            style={rotatedStyle}
            className="display-2 font-display fw-bolder text-body-secondary opacity-25 py-3 mb-0"
          >
            {startYear}
          </h1>
        </nav>
      </div>
    </div>
  );
};

export default YearDisplay;
