// app/widgets/tables/index.ts
// Tables widget barrel exports

export { default as SmartTable } from './SmartTable';
export { default as TableRow } from './TableRow';
export { default as TableCell } from './TableCell';

// Cell renderers
export * from './cellRenderers';

// Utility functions for external components
export const createColumnVisibilityMap = (columns: any[]) => {
  return columns.reduce((map, column) => {
    map[column.key] = column.visible !== false;
    return map;
  }, {});
};

export const filterVisibleColumns = (columns: any[], visibilityMap: Record<string, boolean>) => {
  return columns.map(column => ({
    ...column,
    visible: visibilityMap[column.key] !== false
  }));
};

export const exportTableData = (data: any[], columns: any[], format: 'csv' | 'json' = 'csv') => {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // CSV export
  const headers = columns.map(col => col.header).join(',');
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key];
      // Escape CSV values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
};
