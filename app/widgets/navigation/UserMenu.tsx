import React from 'react';
import { useRouter } from 'next/router';
import {
    Bell,
    BoxArrowRight,
    BrightnessHigh,
    UnlockFill,
    Unlock,
    XDiamond,
    Unlock2,
    ShieldLock
} from 'react-bootstrap-icons';
import { useAuth } from '../../../lib/firebase/AuthContext';
import { useAppStore } from '@/store/store';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { toggleSkin } = useAppStore();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleBackToSite = () => {
    router.push('/');
  };

  return (
    <ul className={`navbar-nav ${className}`}>

      {/* Notifications */}
      <li className="nav-item d-none d-md-inline-block">
        <button 
          type="button" 
          className="btn btn-ghost-secondary btn-icon rounded-circle" 
          title="Notifications"
        >
          <Bell size={16} />
          <span className="btn-status btn-sm-status btn-status-danger"></span>
        </button>
      </li>

      {/* Back to Site */}
      <li className="nav-item">
        <button 
          type="button" 
          className="btn btn-ghost-secondary btn-icon rounded-circle" 
          title="Back to site"
          onClick={handleBackToSite}
        >
          <XDiamond size={16} />
        </button>
      </li>

        {/* Theme Toggle */}
        <li className="nav-item d-none d-sm-inline-block">
            <button
                type="button"
                className="btn btn-ghost-secondary btn-icon rounded-circle"
                onClick={toggleSkin}
                title="Toggle theme"
            >
                <BrightnessHigh size={16} />
            </button>
        </li>

      {/* Logout */}
      <li className="nav-item">
        <button 
          type="button" 
          className="btn btn-ghost-secondary btn-icon rounded-circle" 
          title="Sign out"
          onClick={handleLogout}
        >
          <ShieldLock size={18} />
        </button>
      </li>
    </ul>
  );
};

export default UserMenu;
