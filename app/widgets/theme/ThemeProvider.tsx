import React, { useEffect } from 'react';

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Handle system preference changes only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only listen for system changes if no stored preference exists
    const stored = localStorage.getItem('app-storage');
    if (stored) return; // User has preference, don't override

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Dynamically import to avoid circular dependency
      import('@/store/store').then(({ useAppStore }) => {
        useAppStore.getState().changeSkin(e.matches ? 'dark' : 'light');
      });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;