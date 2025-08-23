// app/types/tables/tables.ts
// Main table configuration types

import { ReactNode } from 'react';
import { ColumnConfig } from './columns';

// ========================
// TABLE VARIANTS
// ========================

export type TableVariant = 'basic' | 'card' | 'responsive';

export type TableSize = 'sm' | 'md' | 'lg';

export type TableTheme = 'default' | 'borderless' | 'hover' | 'striped';

// ========================
// SELECTION TYPES
// ========================

export type SelectionMode = 'none' | 'single' | 'multiple';

export interface SelectionConfig {
  mode: SelectionMode;
  selectedRows: any[]; // Array of selected row data
  onSelectionChange: (selectedRows: any[]) => void;
  selectRowsBy?: string; // Property to use for selection (default: entire row object)
}

// ========================
// TABLE STYLING
// ========================

export interface TableStyling {
  size?: TableSize;
  theme?: TableTheme;
  headerLight?: boolean; // Use thead-light class
  textAlign?: 'left' | 'center' | 'right' | 'end'; // table-text-*
  verticalAlign?: 'top' | 'middle' | 'bottom'; // table-align-*
  nowrap?: boolean; // table-nowrap
  className?: string; // Additional table classes
}

// ========================
// LOADING & EMPTY STATES
// ========================

export interface LoadingConfig {
  show: boolean;
  rowCount?: number; // Number of skeleton rows to show
  message?: string;
}

export interface EmptyStateConfig {
  show: boolean;
  message?: string;
  icon?: string; // Bootstrap icon name
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ========================
// MAIN TABLE CONFIGURATION
// ========================

export interface SmartTableProps {
  // Core data
  data: any[];
  columns: ColumnConfig[];
  
  // Table styling
  variant?: TableVariant;
  styling?: TableStyling;
  title?: string; // For card variant
  
  // Selection
  selection?: SelectionConfig;
  
  // Row interactions
  onRowClick?: (row: any, index: number) => void;
  onRowDoubleClick?: (row: any, index: number) => void;
  
  // States
  loading?: LoadingConfig;
  emptyState?: EmptyStateConfig;
  
  // Additional props
  className?: string;
  id?: string;
  
  // DataTables.js integration (optional)
  dataTable?: boolean; // Enable DataTables.js features
  dataTableOptions?: Record<string, any>; // DataTables configuration
}

// ========================
// UTILITY TYPES
// ========================

export interface TableRowProps {
  row: any;
  index: number;
  columns: ColumnConfig[];
  selection?: SelectionConfig;
  onRowClick?: (row: any, index: number) => void;
  onRowDoubleClick?: (row: any, index: number) => void;
}

export interface TableCellProps {
  value: any;
  row: any;
  column: ColumnConfig;
}

// ========================
// EXPORT TYPES
// ========================

export interface ExportConfig {
  filename?: string;
  includeHeaders?: boolean;
  selectedOnly?: boolean; // Export only selected rows
}

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';
