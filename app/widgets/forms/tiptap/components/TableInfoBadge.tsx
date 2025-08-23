import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/core';

interface TableInfoBadgeProps {
  editor: Editor;
}

const TableInfoBadge: React.FC<TableInfoBadgeProps> = ({ editor }) => {
  const [tableInfo, setTableInfo] = useState<{
    rows: number;
    cols: number;
    isVisible: boolean;
  }>({
    rows: 0,
    cols: 0,
    isVisible: false
  });

  useEffect(() => {
    if (!editor) return;

    const updateTableInfo = () => {
      const isInTable = editor.isActive('table');
      
      if (isInTable) {
        // Get table dimensions
        const { selection } = editor.state;
        const { $from } = selection;
        
        // Find the table node
        for (let i = $from.depth; i >= 0; i--) {
          const node = $from.node(i);
          if (node.type.name === 'table') {
            let rows = 0;
            let cols = 0;
            
            // Count rows and columns
            node.forEach((rowNode) => {
              if (rowNode.type.name === 'tableRow') {
                rows++;
                if (cols === 0) {
                  // Count columns from first row
                  rowNode.forEach((cellNode) => {
                    if (cellNode.type.name === 'tableCell' || cellNode.type.name === 'tableHeader') {
                      cols++;
                    }
                  });
                }
              }
            });
            
            setTableInfo({
              rows,
              cols,
              isVisible: true
            });
            return;
          }
        }
      }
      
      setTableInfo(prev => ({ ...prev, isVisible: false }));
    };

    // Update on selection changes
    editor.on('selectionUpdate', updateTableInfo);
    editor.on('update', updateTableInfo);
    
    // Initial update
    updateTableInfo();

    return () => {
      editor.off('selectionUpdate', updateTableInfo);
      editor.off('update', updateTableInfo);
    };
  }, [editor]);

  if (!tableInfo.isVisible) return null;

  return (
    <div className="position-absolute top-0 end-0 m-2 badge bg-primary text-white" style={{ zIndex: 10 }}>
      Table: {tableInfo.rows} × {tableInfo.cols}
    </div>
  );
};

export default TableInfoBadge;