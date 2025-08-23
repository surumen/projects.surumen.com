import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { NavbarTop, Sidebar, SidebarToggle } from '@/widgets/navbars';
import { AdminNavigation, AdminSearch, UserMenu } from '@/widgets/navigation';
import { LogoIcon } from '@/widgets';
import { useAppStore } from '@/store/store';
import useBodyClasses from '@/hooks/useBodyClasses';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start mini (inverted logic)
  const { skin } = useAppStore();

  // Apply body classes for admin layout
  useBodyClasses([
    'has-navbar-vertical-aside',
    'navbar-vertical-aside-show-xl',
    'footer-offset',
    isCollapsed ? 'navbar-vertical-aside-mini-mode' : '',
    'navbar-vertical-aside-transition-on'
  ]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Header */}
      <NavbarTop>
        {/* Logo */}
        <Link href="/admin" className="navbar-brand" aria-label="Admin">
          <div style={{ width: '40px', height: '40px' }}>
            <LogoIcon primary="#377dff" dark="#132144" />
          </div>
        </Link>

        <div className="navbar-nav-wrap-content-start">
          {/* Sidebar Toggle */}
          <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleSidebar} />
          
          {/* Search */}
          <AdminSearch />
        </div>

        <div className="navbar-nav-wrap-content-end">
          {/* User Menu */}
          <UserMenu />
        </div>
      </NavbarTop>

      {/* Sidebar */}
      <Sidebar>
        <div className="navbar-vertical-footer-offset">
          {/* Logo */}
          <Link href="/admin" className="navbar-brand" aria-label="Admin">
            <div style={{ width: isCollapsed ? '32px' : '120px', height: '40px' }}>
              <LogoIcon primary="#377dff" dark="#132144" />
            </div>
          </Link>

          {/* Sidebar Toggle */}
          <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleSidebar} />

          {/* Navigation */}
          <AdminNavigation isCollapsed={isCollapsed} />
        </div>
      </Sidebar>

      {/* Main Content */}
      <main id="content" role="main" className="main">
        <div className="content container-fluid">
          {children}
        </div>
      </main>
    </>
  );
};

export default AdminLayout;
