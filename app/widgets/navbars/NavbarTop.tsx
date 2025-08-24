import React from 'react';

interface NavbarTopProps {
  className?: string;
  children: React.ReactNode;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <header 
      id="header" 
      className={`navbar navbar-expand-lg navbar-fixed navbar-height navbar-container navbar-bordered bg-body ${className}`}
    >
      <div className="navbar-nav-wrap">
        {children}
      </div>
    </header>
  );
};

export default NavbarTop;
