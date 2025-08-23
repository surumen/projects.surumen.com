import React from 'react';

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <aside className={`js-navbar-vertical-aside navbar navbar-vertical-aside navbar-vertical navbar-vertical-fixed navbar-expand-xl navbar-bordered bg-body navbar-vertical-aside-initialized ${className}`}>
      <div className="navbar-vertical-container">
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;
