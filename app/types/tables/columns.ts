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
  | 'custom';

// ========================
// FORMATTING TYPES
// ========================

export type FormatType = 'date' | 'datetime' | 'time' | 'currency' | 'number' | 'relative';

export interface DateTimeFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZone?: string;
  hour12?: boolean;
}

export interface NumberFormatOptions {
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface FormatConfig {
  type: FormatType;
  options?: DateTimeFormatOptions | NumberFormatOptions;
  locale?: string;
}

export type ColumnFormat = 
  | FormatType 
  | FormatConfig 
  | ((value: any) => string);

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
  // Properties for array/technologies support
  maxVisible?: number; // Maximum number of technologies to show (for arrays)
  showMoreText?: boolean; // Show "+X more" for remaining technologies (for arrays)
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
  renderer?: ColumnRenderer; // Optional - defaults to 'text'
  format?: ColumnFormat; // Optional - formatting for text renderer
  
  // Renderer-specific configurations
  linkConfig?: LinkRendererConfig;
  badgeConfig?: BadgeRendererConfig;
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
