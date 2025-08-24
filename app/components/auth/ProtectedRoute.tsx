import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/firebase/AuthContext';
import { isAdminEmail } from '../../../lib/firebase/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  fallbackPath = '/admin/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user || !isAdminEmail(user.email || '')) {
      router.push(fallbackPath);
    }
  }, [user, loading, router, fallbackPath]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdminEmail(user.email || '')) {
    return null;
  }

  return <>{children}</>;
}