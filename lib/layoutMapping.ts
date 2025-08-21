// lib/layoutMapping.ts
import { ComponentType } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import ProjectLayout from '../layouts/ProjectLayout';
import BlankLayout from '../layouts/BlankLayout';
import AdminLayout from '../layouts/AdminLayout';

// Type definitions for layouts
export type LayoutComponent = ComponentType<{ children: React.ReactNode }>;

export interface PageWithLayout {
  Layout?: LayoutComponent | string;
}

/**
 * Simple layout assignment based on pathname
 */
export function getLayoutForRoute(pathname: string): LayoutComponent {
  if (pathname.startsWith('/admin')) {
    return AdminLayout;
  }
  
  if (pathname.startsWith('/project')) {
    return ProjectLayout;
  }
  
  if (pathname.startsWith('/login')) {
    return BlankLayout;
  }
  
  return DefaultLayout;
}

/**
 * Get layout component by name
 */
export function getLayoutByName(layoutName: string): LayoutComponent {
  switch (layoutName) {
    case 'admin':
      return AdminLayout;
    case 'project':
      return ProjectLayout;
    case 'blank':
      return BlankLayout;
    case 'default':
    default:
      return DefaultLayout;
  }
}
