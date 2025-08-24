import React from 'react';
import type { Editor } from '@tiptap/core';
import { 
  Plus, 
  Dash, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Grid3x3Gap,
  Scissors,
  Trash,
  ToggleOn,
  ToggleOff
} from 'react-bootstrap-icons';

interface TableToolbarProps {
  editor: Editor;
  isVisible: boolean;
}

const TableToolbar: React.FC<TableToolbarProps> = ({ editor, isVisible }) => {
  if (!isVisible || !editor.isActive('table')) return null;

  // Simple table manipulation commands
  const commands = [
    {
      group: 'Row Operations',
      items: [
        {
          icon: <ArrowUp size={16} />,
          label: 'Add Row Above',
          command: () => editor.chain().focus().addRowBefore().run(),
          canExecute: editor.can().addRowBefore(),
          variant: 'outline-primary'
        },
        {
          icon: <ArrowDown size={16} />,
          label: 'Add Row Below',
          command: () => editor.chain().focus().addRowAfter().run(),
          canExecute: editor.can().addRowAfter(),
          variant: 'outline-primary'
        },
        {
          icon: <Dash size={16} />,
          label: 'Delete Row',
          command: () => editor.chain().focus().deleteRow().run(),
          canExecute: editor.can().deleteRow(),
          variant: 'outline-danger'
        }
      ]
    },
    {
      group: 'Column Operations',
      items: [
        {
          icon: <ArrowLeft size={16} />,
          label: 'Add Column Left',
          command: () => editor.chain().focus().addColumnBefore().run(),
          canExecute: editor.can().addColumnBefore(),
          variant: 'outline-primary'
        },
        {
          icon: <ArrowRight size={16} />,
          label: 'Add Column Right',
          command: () => editor.chain().focus().addColumnAfter().run(),
          canExecute: editor.can().addColumnAfter(),
          variant: 'outline-primary'
        },
        {
          icon: <Dash size={16} />,
          label: 'Delete Column',
          command: () => editor.chain().focus().deleteColumn().run(),
          canExecute: editor.can().deleteColumn(),
          variant: 'outline-danger'
        }
      ]
    },
    {
      group: 'Cell Operations',
      items: [
        {
          icon: <Grid3x3Gap size={16} />,
          label: 'Merge Cells',
          command: () => editor.chain().focus().mergeCells().run(),
          canExecute: editor.can().mergeCells(),
          variant: 'outline-secondary'
        },
        {
          icon: <Scissors size={16} />,
          label: 'Split Cell',
          command: () => editor.chain().focus().splitCell().run(),
          canExecute: editor.can().splitCell(),
          variant: 'outline-secondary'
        }
      ]
    },
    {
      group: 'Table Options',
      items: [
        {
          icon: editor.getAttributes('tableRow').header ? <ToggleOn size={16} /> : <ToggleOff size={16} />,
          label: 'Toggle Header Row',
          command: () => editor.chain().focus().toggleHeaderRow().run(),
          canExecute: editor.can().toggleHeaderRow(),
          variant: 'outline-info'
        },
        {
          icon: <Trash size={16} />,
          label: 'Delete Table',
          command: () => editor.chain().focus().deleteTable().run(),
          canExecute: editor.can().deleteTable(),
          variant: 'outline-danger'
        }
      ]
    }
  ];

  return (
    <div className="bg-light border-bottom p-2">
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <small className="text-muted fw-bold me-2">Table Tools:</small>
        
        {commands.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {groupIndex > 0 && <div className="vr" />}
            
            <div className="btn-group" role="group" aria-label={group.group}>
              {group.items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn btn-sm btn-${item.variant}`}
                  onClick={item.command}
                  disabled={!item.canExecute}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TableToolbar;