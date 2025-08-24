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
      <div className="nav nav-pills nav-vertical card-navbar-nav">
        {/* Dashboard */}
        <div className="nav-item">
          <Link 
            href="/admin"
            className={`nav-link justify-content-center align-items-center ${isActive('/admin') ? 'active' : ''}`}
          >
            <HouseDoor size={18} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title">Dashboard</span>}
          </Link>
        </div>

        {/* Pages Section */}
        <span className="dropdown-header mt-4">Pages</span>
        <small className="bi-three-dots nav-subtitle-replacer"></small>

        {/* Projects */}
        <div className="nav-item">
          <Link 
            href="/admin"
            className={`nav-link justify-content-center align-items-cente ${isActive('/admin/project') ? 'active' : ''}`}
            data-placement="left"
          >
            <Book size={18} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title">Projects</span>}
          </Link>
        </div>

        {/* Posts (placeholder) */}
        <div className="nav-item">
          <Link 
            href="#"
            className="nav-link justify-content-center align-items-cente"
          >
            <Layers size={18} className="nav-icon" />
            {!isCollapsed && <span className="nav-link-title">Posts</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
