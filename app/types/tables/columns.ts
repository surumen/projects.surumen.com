// app/types/tables/columns.ts
// Column configuration types

import { ReactNode } from 'react';

// ========================
// COLUMN RENDERER TYPES
// ========================

export type ColumnRenderer = 
  | 'text' 
  | 'link' 
  | 'badge' 
  | 'avatar' 
  | 'actions' 
  | 'paymentMethod'
  | 'technologies'
  | 'custom';

// ========================
// RENDERER CONFIGURATIONS
// ========================

export interface LinkRendererConfig {
  linkPattern: string; // e.g., '/order/{orderId}' or '/customer/{customerId}'
  className?: string;
  target?: '_blank' | '_self';
}

export interface BadgeRendererConfig {
  colorMap?: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>;
  colorFunction?: (value: string) => string; // Function that returns accent color (e.g., getTechnologyScheme)
  showIndicator?: boolean; // For legend-indicator dot
  className?: string;
}

export interface AvatarRendererConfig {
  imagePath?: string; // Path to image property in data
  namePath: string; // Path to name property in data  
  subtitlePath?: string; // Path to subtitle/email property in data
  showInitials?: boolean; // Show initials if no image
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
}

export interface PaymentMethodRendererConfig {
  imagePath: string; // Path to payment icon in data
  textPath: string; // Path to payment text in data (e.g., '•••• 4242')
}

export interface ActionButton {
  label: string;
  icon?: string; // Bootstrap icon name (e.g., 'eye', 'pencil')
  href?: string; // For links - supports patterns like '/order/{orderId}'
  onClick?: (row: any) => void; // For click handlers
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ActionDropdownItem {
  label: string;
  icon?: string; // Bootstrap icon name or image path
  href?: string; // For links - supports patterns
  onClick?: (row: any) => void; // For click handlers
  variant?: 'default' | 'danger';
  divider?: boolean; // Add divider after this item
}

export interface ActionsRendererConfig {
  buttons?: ActionButton[]; // Primary action buttons
  dropdown?: ActionDropdownItem[]; // Dropdown menu items
  dropdownIcon?: string; // Icon for dropdown toggle
}

export interface CustomRendererConfig {
  render: (value: any, row: any, columnKey: string) => ReactNode;
}

// ========================
// COLUMN CONFIGURATION
// ========================

export interface ColumnConfig {
  key: string; // Property key in data object
  header: string; // Column title
  renderer: ColumnRenderer;
  
  // Renderer-specific configurations
  linkConfig?: LinkRendererConfig;
  badgeConfig?: BadgeRendererConfig;
  avatarConfig?: AvatarRendererConfig;
  paymentMethodConfig?: PaymentMethodRendererConfig;
  actionsConfig?: ActionsRendererConfig;
  customConfig?: CustomRendererConfig;
  
  // Column behavior
  sortable?: boolean;
  searchable?: boolean;
  width?: string | number; // CSS width value
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string; // Additional CSS classes
  
  // Conditional rendering
  visible?: boolean; // Can be controlled externally
  hideOnMobile?: boolean;
}

// ========================
// COLUMN UTILITIES
// ========================

export interface ColumnToggleItem {
  key: string;
  label: string;
  visible: boolean;
}

export type ColumnVisibilityMap = Record<string, boolean>;
