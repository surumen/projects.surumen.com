import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HouseDoor,
  Book,
  Layers,
  PencilSquare,
  UiChecksGrid,
  PlusSquare,
  PlusSquareDotted
} from 'react-bootstrap-icons';

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
            title="Dashboard"
            className={`nav-link justify-content-center align-items-center ${isActive('/admin') ? 'active' : ''}`}
          >
            <UiChecksGrid size={24} className="nav-icon text-muted" />
          </Link>
        </div>

        {/* Projects */}
        <div className="nav-item">
          <Link 
            href="/admin/project/new"
            className={`nav-link justify-content-center align-items-cente ${isActive('/admin/project/new') ? 'active' : ''}`}
            title="Create New Project"
          >
            <PlusSquareDotted size={24} className="nav-icon text-warning" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminNavigation;
