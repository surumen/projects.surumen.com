import React, { ReactNode } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../lib/firebase/AuthContext';
import { LogoIcon } from '@/widgets';
import { ArrowLeft, Book, ChevronLeft, List, Lock, PlusCircle, X } from 'react-bootstrap-icons';

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
      <div className="navbar navbar-expand-lg navbar-bordered bg-white">
        <Container>
          <div className="navbar-nav-wrap">
            {/* Logo */}
            <Navbar.Brand className="d-flex align-items-center">
              <Link href="/admin" className="d-flex align-items-center text-decoration-none">
                <div style={{ width: '32px', height: '32px' }}>
                  <LogoIcon primary="#377dff" dark="#132144" />
                </div>
              </Link>
            </Navbar.Brand>

            {/* Secondary Content */}
            <div className="navbar-nav-wrap-secondary-content ms-auto">
              <Nav className="navbar-nav">
                <Nav.Item>
                  <button
                    onClick={handleBackToSite}
                    className="btn btn-sm btn-ghost-secondary me-2"
                  >
                    <ArrowLeft size={12} className='me-1' />
                    Back to Site
                  </button>
                </Nav.Item>

                <Nav.Item>
                  <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-white"
                  >
                    <Lock size={12} className='me-1' />
                    Sign Out
                  </button>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <main role="main" className="main">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
