import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../lib/firebase/AuthContext';
import { LogoIcon } from '@/widgets';
import { House, Files, AppIndicator, Bell, Unlock, ArrowRight } from 'react-bootstrap-icons';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleBackToSite = () => {
    router.push('/');
  };

  return (
    <>
      {/* Admin Header */}
      <header id="header" className="navbar navbar-expand-lg navbar-bordered">
        <div className="container">
          <nav className="js-mega-menu navbar-nav-wrap hs-menu-initialized hs-menu-horizontal">
            {/* Logo */}
            <Link href="/admin" className="navbar-brand" aria-label="Admin">
              <div className="navbar-brand-logo" style={{ width: '40px', height: '40px' }}>
                <LogoIcon primary="#377dff" dark="#132144" />
              </div>
            </Link>

            {/* Secondary Content */}
            <div className="navbar-nav-wrap-secondary-content">
              {/* Navbar */}
              <ul className="navbar-nav">
                <li className="nav-item d-none d-md-inline-block">
                  {/* Notification */}
                  <button 
                    type="button" 
                    className="btn btn-ghost-secondary btn-icon rounded-circle" 
                    title="Notifications coming soon"
                  >
                    <Bell size={16} />
                    <span className="btn-status btn-sm-status btn-status-danger"></span>
                  </button>
                  {/* End Notification */}
                </li>

                <li className="nav-item">
                  {/* Sign Out */}
                  <button 
                    type="button" 
                    className="btn btn-ghost-secondary btn-icon rounded-circle" 
                    title="Sign out"
                    onClick={handleLogout}
                  >
                    <Unlock size={16} />
                  </button>
                  {/* End Sign Out */}
                </li>

                <li className="nav-item">
                  {/* Go to Site */}
                  <button 
                    type="button" 
                    className="btn btn-ghost-secondary btn-icon rounded-circle" 
                    title="Go to site"
                    onClick={handleBackToSite}
                  >
                    <ArrowRight size={16} />
                  </button>
                  {/* End Go to Site */}
                </li>
              </ul>
              {/* End Navbar */}
            </div>
            {/* End Secondary Content */}

            {/* Toggler */}
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarContainerNavDropdown" 
              aria-controls="navbarContainerNavDropdown" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-default">
                <i className="bi-list"></i>
              </span>
              <span className="navbar-toggler-toggled">
                <i className="bi-x"></i>
              </span>
            </button>
            {/* End Toggler */}

            {/* Collapse */}
            <div className="collapse navbar-collapse" id="navbarContainerNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link 
                    href="/admin" 
                    className={`nav-link ${router.pathname === '/admin' ? 'active' : ''}`}
                  >
                    <House size={16} className="nav-icon me-2" /> Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link 
                    href="/admin" 
                    className={`nav-link ${router.pathname.startsWith('/admin/project') ? 'active' : ''}`}
                  >
                    <Files size={16} className="nav-icon me-2" /> Projects
                  </Link>
                </li>

                <li className="hs-has-sub-menu nav-item">
                  <a 
                    id="appsMegaMenu" 
                    className="hs-mega-menu-invoker nav-link dropdown-toggle" 
                    href="#" 
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <AppIndicator size={16} className="nav-icon me-2" /> Apps
                  </a>

                  <div className="hs-sub-menu dropdown-menu navbar-dropdown-menu-borderless hs-sub-menu-desktop-lg">
                    <Link href="/brackets" className="dropdown-item">
                      Brackets
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
            {/* End Collapse */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main role="main" className="main">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;