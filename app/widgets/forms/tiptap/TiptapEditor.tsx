import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Extension } from '@tiptap/core';
import TiptapToolbar from './TiptapToolbar';
import TableToolbar from './components/TableToolbar';
import TableContextMenu from './components/TableContextMenu';
import TableInfoBadge from './components/TableInfoBadge';
import { ToolbarConfig } from './config/toolbarConfig';
import { getExtensions } from './config/extensionSets';

export interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  toolbar?: ToolbarConfig;
  extensions?: Extension[];
  height?: number;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  showToolbar?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  onBlur,
  toolbar = 'basic',
  extensions = [],
  height = 200,
  placeholder,
  readOnly = false,
  className = '',
  showToolbar = true
}) => {
  const [isInTable, setIsInTable] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    position: { x: 0, y: 0 }
  });

  // Get base extensions and merge with custom ones
  // Use full extension set for full toolbar, otherwise basic
  const extensionSet = toolbar === 'full' ? 'full' : 'basic';
  const allExtensions = getExtensions(extensionSet, extensions);

  // Create editor instance
  const editor = useEditor({
    extensions: allExtensions,
    content: value || '',
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // Check if cursor is in table
      setIsInTable(editor.isActive('table'));
    },
    onSelectionUpdate: ({ editor }) => {
      // Update table state when selection changes
      setIsInTable(editor.isActive('table'));
    },
    onBlur: () => {
      onBlur?.();
      setIsInTable(false);
    },
    editorProps: {
      attributes: {
        class: `p-3`,
        style: `min-height: ${height}px; outline: none;`
      },
      handleDOMEvents: {
        contextmenu: (view, event) => {
          // Show context menu only when in table
          if (editor?.isActive('table')) {
            event.preventDefault();
            setContextMenu({
              isVisible: true,
              position: { x: event.clientX, y: event.clientY }
            });
            return true;
          }
          return false;
        }
      }
    }
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  // Update table state when editor becomes available
  useEffect(() => {
    if (editor) {
      setIsInTable(editor.isActive('table'));
    }
  }, [editor]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, isVisible: false }));
    };

    if (contextMenu.isVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.isVisible]);

  if (!editor) {
    return (
      <div className={`border rounded ${className}`}>
        <div className="d-flex justify-content-center p-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading editor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded overflow-hidden position-relative ${className}`}>
      {showToolbar && (
        <TiptapToolbar 
          editor={editor} 
          config={toolbar} 
          disabled={readOnly}
        />
      )}
      
      {/* Table manipulation toolbar - shows when cursor is in table */}
      <TableToolbar 
        editor={editor} 
        isVisible={isInTable && !readOnly} 
      />
      
      <div className="position-relative">
        <EditorContent editor={editor} className="tiptap-editor-content" />
        
        {/* Table info badge */}
        <TableInfoBadge editor={editor} />
      </div>
      
      {/* Context menu for table operations */}
      <TableContextMenu
        editor={editor}
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onClose={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default TiptapEditor;