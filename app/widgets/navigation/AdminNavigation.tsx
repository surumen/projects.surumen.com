import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HouseDoor, Book, Layers } from 'react-bootstrap-icons';

interface AdminNavigationProps {
  isCollapsed?: boolean;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ isCollapsed = false }) => {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className="navbar-vertical-content">
      <div id="navbarVerticalMenu" className="nav nav-pills nav-vertical card-navbar-nav">
        {/* Dashboard */}
        <div className="nav-item">
          <Link 
            href="/admin"
            className={`nav-link text-body ${isActive('/admin') ? 'active' : ''}`}
          >
            <HouseDoor size={16} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title text-body">Dashboard</span>}
          </Link>
        </div>

        {/* Pages Section */}
        <span className="dropdown-header text-body mt-4">Pages</span>
        <small className="bi-three-dots nav-subtitle-replacer"></small>

        {/* Projects */}
        <div className="nav-item">
          <Link 
            href="/admin"
            className={`nav-link text-body ${isActive('/admin/project') ? 'active' : ''}`}
            data-placement="left"
          >
            <Book size={16} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title">Projects</span>}
          </Link>
        </div>

        {/* Posts (placeholder) */}
        <div className="nav-item">
          <Link 
            href="#"
            className="nav-link text-body"
            data-placement="left"
          >
            <Layers size={16} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title">Posts</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
