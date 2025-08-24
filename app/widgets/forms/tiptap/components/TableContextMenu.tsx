import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import { 
  Plus, 
  Dash, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Grid3x3Gap,
  Palette,
  BucketFill,
  Trash,
  Scissors
} from 'react-bootstrap-icons';

interface TableContextMenuProps {
  editor: Editor;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({ 
  editor, 
  isVisible, 
  position, 
  onClose 
}) => {
  const [isInTable, setIsInTable] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsInTable(editor.isActive('table'));
    }
  }, [isVisible, editor]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('table-context-menu');
      if (menu && !menu.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Simple table manipulation commands
  const tableCommands = {
    addRowBefore: () => editor.chain().focus().addRowBefore().run(),
    addRowAfter: () => editor.chain().focus().addRowAfter().run(),
    deleteRow: () => editor.chain().focus().deleteRow().run(),
    addColumnBefore: () => editor.chain().focus().addColumnBefore().run(),
    addColumnAfter: () => editor.chain().focus().addColumnAfter().run(),
    deleteColumn: () => editor.chain().focus().deleteColumn().run(),
    deleteTable: () => editor.chain().focus().deleteTable().run(),
    mergeCells: () => editor.chain().focus().mergeCells().run(),
    splitCell: () => editor.chain().focus().splitCell().run(),
    toggleHeaderRow: () => editor.chain().focus().toggleHeaderRow().run(),
    toggleHeaderColumn: () => editor.chain().focus().toggleHeaderColumn().run(),
  };

  // Cell styling commands
  const setCellBackground = (color: string) => {
    editor.chain().focus().setCellAttribute('style', `background-color: ${color}`).run();
    onClose();
  };

  // Check if commands are available
  const canExecute = {
    addRowBefore: editor.can().addRowBefore(),
    addRowAfter: editor.can().addRowAfter(),
    deleteRow: editor.can().deleteRow(),
    addColumnBefore: editor.can().addColumnBefore(),
    addColumnAfter: editor.can().addColumnAfter(),
    deleteColumn: editor.can().deleteColumn(),
    deleteTable: editor.can().deleteTable(),
    mergeCells: editor.can().mergeCells(),
    splitCell: editor.can().splitCell(),
    toggleHeaderRow: editor.can().toggleHeaderRow(),
    toggleHeaderColumn: editor.can().toggleHeaderColumn(),
  };

  const handleCommand = (command: keyof typeof tableCommands) => {
    if (canExecute[command]) {
      tableCommands[command]();
      onClose();
    }
  };

  if (!isVisible || !isInTable) return null;

  // Color options using your theme colors
  const cellColors = [
    { name: 'Default', color: 'transparent' },
    { name: 'Rust Soft', color: 'rgba(190, 75, 10, 0.1)' },
    { name: 'Canopy Soft', color: 'rgba(15, 80, 60, 0.1)' },
    { name: 'Navy Soft', color: 'rgba(40, 55, 80, 0.1)' },
    { name: 'Plum Soft', color: 'rgba(120, 40, 110, 0.1)' },
    { name: 'Zen Soft', color: 'rgba(20, 200, 235, 0.1)' },
    { name: 'Sunset Soft', color: 'rgba(250, 85, 30, 0.1)' },
    { name: 'Lime Soft', color: 'rgba(180, 220, 25, 0.1)' },
  ];

  return (
    <div
      id="table-context-menu"
      className="position-fixed bg-white border rounded shadow-lg py-2"
      style={{
        left: position.x,
        top: position.y,
        minWidth: '220px',
        zIndex: 9999
      }}
    >
      {/* Row Operations */}
      <div className="px-2 py-1">
        <small className="text-muted fw-bold">Row Operations</small>
      </div>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('addRowBefore')}
        disabled={!canExecute.addRowBefore}
      >
        <ArrowUp size={16} className="me-2" />
        Add Row Above
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('addRowAfter')}
        disabled={!canExecute.addRowAfter}
      >
        <ArrowDown size={16} className="me-2" />
        Add Row Below
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center text-danger"
        onClick={() => handleCommand('deleteRow')}
        disabled={!canExecute.deleteRow}
      >
        <Dash size={16} className="me-2" />
        Delete Row
      </button>

      <hr className="my-1" />

      {/* Column Operations */}
      <div className="px-2 py-1">
        <small className="text-muted fw-bold">Column Operations</small>
      </div>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('addColumnBefore')}
        disabled={!canExecute.addColumnBefore}
      >
        <ArrowLeft size={16} className="me-2" />
        Add Column Left
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('addColumnAfter')}
        disabled={!canExecute.addColumnAfter}
      >
        <ArrowRight size={16} className="me-2" />
        Add Column Right
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center text-danger"
        onClick={() => handleCommand('deleteColumn')}
        disabled={!canExecute.deleteColumn}
      >
        <Dash size={16} className="me-2" />
        Delete Column
      </button>

      <hr className="my-1" />

      {/* Cell Operations */}
      <div className="px-2 py-1">
        <small className="text-muted fw-bold">Cell Operations</small>
      </div>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('mergeCells')}
        disabled={!canExecute.mergeCells}
      >
        <Grid3x3Gap size={16} className="me-2" />
        Merge Cells
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('splitCell')}
        disabled={!canExecute.splitCell}
      >
        <Scissors size={16} className="me-2" />
        Split Cell
      </button>

      <hr className="my-1" />

      {/* Cell Background Colors */}
      <div className="px-2 py-1">
        <small className="text-muted fw-bold">Cell Background</small>
      </div>
      
      <div className="px-3 py-2">
        <div className="d-flex flex-wrap gap-1">
          {cellColors.map((colorOption) => (
            <button
              key={colorOption.name}
              className="btn btn-sm border-0 p-1 rounded"
              onClick={() => setCellBackground(colorOption.color)}
              title={colorOption.name}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: colorOption.color
              }}
            />
          ))}
        </div>
      </div>

      <hr className="my-1" />

      {/* Header Operations */}
      <div className="px-2 py-1">
        <small className="text-muted fw-bold">Header Options</small>
      </div>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('toggleHeaderRow')}
        disabled={!canExecute.toggleHeaderRow}
      >
        <Plus size={16} className="me-2" />
        Toggle Header Row
      </button>
      
      <button
        className="dropdown-item d-flex align-items-center"
        onClick={() => handleCommand('toggleHeaderColumn')}
        disabled={!canExecute.toggleHeaderColumn}
      >
        <Plus size={16} className="me-2" />
        Toggle Header Column
      </button>

      <hr className="my-1" />

      {/* Delete Table */}
      <button
        className="dropdown-item d-flex align-items-center text-danger"
        onClick={() => handleCommand('deleteTable')}
        disabled={!canExecute.deleteTable}
      >
        <Trash size={16} className="me-2" />
        Delete Table
      </button>
    </div>
  );
};

export default TableContextMenu;