import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HouseDoor, Book, Layers, PencilSquare } from 'react-bootstrap-icons';

interface AdminNavigationProps {
  isCollapsed?: boolean;
}

const AdminNavigation: React.FC<AdminNavigationProps> = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className="navbar-vertical-content">
      <div className="nav nav-pills nav-vertical card-navbar-nav gap-4">
        {/* Dashboard */}
        <div className="nav-item">
          <Link 
            href="/admin"
            className={`nav-link justify-content-center align-items-center ${isActive('/admin') ? 'active' : ''}`}
          >
            <HouseDoor size={24} className="nav-icon text-muted" />
          </Link>
        </div>

        {/* Projects */}
        <div className="nav-item">
          <Link 
            href="/admin/project/new"
            className={`nav-link justify-content-center align-items-cente ${isActive('/admin/project/new') ? 'active' : ''}`}
            data-placement="left"
          >
            <PencilSquare size={24} className="nav-icon text-muted" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminNavigation;
