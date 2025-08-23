// lib/layoutMapping.ts
import { ComponentType } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import PortfolioLayout from '../layouts/PortfolioLayout';
import BlankLayout from '../layouts/BlankLayout';

// Type definitions for layouts
export type LayoutComponent = ComponentType<{ children: React.ReactNode }>;

export interface PageWithLayout {
  Layout?: LayoutComponent | string;
}

/**
 * Updated layout assignment based on pathname
 * - Admin pages get full admin layout (header + sidebar)
 * - Auth pages get blank layout (centered content)
 * - Everything else gets portfolio layout (sidebar only)
 */
export function getLayoutForRoute(pathname: string): LayoutComponent {
  // Admin pages (except login)
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    return AdminLayout;
  }
  
  // Auth pages (login, etc.)
  if (pathname === '/admin/login' || pathname.startsWith('/auth')) {
    return BlankLayout;
  }
  
  // Portfolio pages (homepage, projects, etc.)
  return PortfolioLayout;
}

/**
 * Get layout component by name
 */
export function getLayoutByName(layoutName: string): LayoutComponent {
  switch (layoutName) {
    case 'admin':
      return AdminLayout;
    case 'portfolio':
      return PortfolioLayout;
    case 'blank':
      return BlankLayout;
    default:
      return PortfolioLayout; // Default to portfolio
  }
}
