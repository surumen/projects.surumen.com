import React, { ReactNode } from 'react';
import Link from 'next/link';
import { NavbarTop, Sidebar } from '@/widgets/navbars';
import { AdminNavigation, AdminSearch, UserMenu } from '@/widgets/navigation';
import { LogoIcon } from '@/widgets';
import useBodyClasses from '@/hooks/useBodyClasses';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {

  // Apply body classes for admin layout
  useBodyClasses([
    'has-navbar-vertical-aside',
    'navbar-vertical-aside-show-md',
    'footer-offset',
    'navbar-vertical-aside-mini-mode',
    'navbar-vertical-aside-transition-on'
  ]);


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
            <div>
              <LogoIcon primary="#377dff" dark="#132144" />
            </div>
          </Link>

          {/* Navigation */}
          <AdminNavigation />
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
