import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowBarLeft, ArrowBarRight } from 'react-bootstrap-icons';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  isCollapsed, 
  onToggle, 
  className = "" 
}) => {
  return (
    <Button 
      type="button" 
      className={`js-navbar-vertical-aside-toggle-invoker navbar-aside-toggler ${className}`}
      onClick={onToggle}
      style={{ opacity: 1 }}
      title={isCollapsed ? "Expand" : "Collapse"}
    >
      {isCollapsed ? (
        <ArrowBarRight 
          size={16}
          className='navbar-toggler-full-align'
        />
      ) : (
        <ArrowBarLeft 
          size={16}
          className="navbar-toggler-short-align"
        />
      )}
    </Button>
  );
};

export default SidebarToggle;
