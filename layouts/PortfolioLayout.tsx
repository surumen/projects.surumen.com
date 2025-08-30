import React, { ReactNode } from 'react';
import Link from 'next/link';
import { NavbarTop, Sidebar } from '@/widgets/navbars';
import { YearDisplay } from '@/widgets';
import PortfolioNavbar from '@/widgets/navbars/PortfolioNavbar';
import { LogoIcon } from '@/widgets';
import useBodyClasses from '@/hooks/useBodyClasses';

interface PortfolioLayoutProps {
  children: ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ children }) => {
  // Apply body classes for portfolio layout (matching your current setup)
  useBodyClasses([
    'has-navbar-vertical-aside',
    'navbar-vertical-aside-show',
    'navbar-vertical-aside-compact-mode',
    'navbar-vertical-aside-transition-on',
    // 'navbar-vertical-aside-closed-mode'
  ]);

  return (
    <>
      {/* Portfolio Navbar */}
      <NavbarTop>
        <PortfolioNavbar />
      </NavbarTop>

      {/* Portfolio Sidebar */}
      <Sidebar className="d-none d-md-block">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex justify-content-center navbar-brand px-3 mt-3">
          <LogoIcon primary="#377dff" dark="#1c232c" />
        </Link>

        {/* Year Display */}
        <YearDisplay startYear={2015} />
      </Sidebar>

      {/* Main Content */}
      <main id="content" role="main" className="main">
        {children}
      </main>
    </>
  );
};

export default PortfolioLayout;
