// app/widgets/components/table/types/export.ts
// Export configuration and types

/**
 * Supported export formats
 */
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json' | 'print'

/**
 * Export configuration
 */
export interface ExportConfig<T = any> {
  /** Available export formats */
  formats?: ExportFormat[]
  /** Default filename (without extension) */
  filename?: string
  /** Whether to include table headers */
  includeHeaders?: boolean
  /** Whether to export only selected rows */
  selectedOnly?: boolean
  /** Custom column mapping for export */
  columnMapping?: Record<string, string>
  /** Columns to exclude from export */
  excludeColumns?: string[]
  /** Custom data transformer */
  transform?: (data: T[]) => any[]
}

/**
 * Export state returned by useTableExport
 */
export interface ExportState<T = any> {
  /** Whether export is in progress */
  isExporting: boolean
  /** Last export error */
  error: string | null
  /** Available export formats */
  formats: ExportFormat[]
  
  /** Export functions */
  exportToCsv: (options?: ExportOptions) => Promise<void>
  exportToExcel: (options?: ExportOptions) => Promise<void>
  exportToPdf: (options?: ExportOptions) => Promise<void>
  exportToJson: (options?: ExportOptions) => Promise<void>
  print: (options?: ExportOptions) => Promise<void>
  
  /** Generic export function */
  exportAs: (format: ExportFormat, options?: ExportOptions) => Promise<void>
  
  /** Get download URL for data */
  getDownloadUrl: (format: ExportFormat, options?: ExportOptions) => string
}

/**
 * Options for individual export operations
 */
export interface ExportOptions<T = any> {
  /** Custom filename */
  filename?: string
  /** Include headers */
  includeHeaders?: boolean
  /** Export selected rows only */
  selectedOnly?: boolean
  /** Custom data subset */
  data?: T[]
  /** Column mapping */
  columnMapping?: Record<string, string>
  /** Exclude columns */
  excludeColumns?: string[]
  /** Data transformer */
  transform?: (data: T[]) => any[]
}

/**
 * CSV export options
 */
export interface CsvExportOptions extends ExportOptions {
  /** CSV delimiter */
  delimiter?: string
  /** Quote character */
  quote?: string
  /** Line ending */
  lineEnding?: '\n' | '\r\n'
  /** BOM for UTF-8 */
  includeBom?: boolean
}

/**
 * Excel export options
 */
export interface ExcelExportOptions extends ExportOptions {
  /** Worksheet name */
  sheetName?: string
  /** Auto-fit columns */
  autoFitColumns?: boolean
  /** Header styling */
  headerStyle?: ExcelCellStyle
  /** Data styling */
  dataStyle?: ExcelCellStyle
}

/**
 * PDF export options
 */
export interface PdfExportOptions extends ExportOptions {
  /** Page orientation */
  orientation?: 'portrait' | 'landscape'
  /** Page size */
  pageSize?: 'A4' | 'Letter' | 'Legal'
  /** Title for PDF */
  title?: string
  /** Include page numbers */
  includePageNumbers?: boolean
  /** Header/footer content */
  header?: string
  footer?: string
}

/**
 * Excel cell styling
 */
export interface ExcelCellStyle {
  /** Font options */
  font?: {
    name?: string
    size?: number
    bold?: boolean
    italic?: boolean
    color?: string
  }
  /** Fill options */
  fill?: {
    type?: 'solid' | 'gradient'
    color?: string
  }
  /** Border options */
  border?: {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
    color?: string
  }
  /** Alignment */
  alignment?: {
    horizontal?: 'left' | 'center' | 'right'
    vertical?: 'top' | 'middle' | 'bottom'
  }
}

/**
 * Print options
 */
export interface PrintOptions extends ExportOptions {
  /** Print title */
  title?: string
  /** Page orientation */
  orientation?: 'portrait' | 'landscape'
  /** Custom CSS for print */
  printStyles?: string
  /** Show browser print dialog */
  showPrintDialog?: boolean
}
