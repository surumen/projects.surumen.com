import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Extension } from '@tiptap/core';
import TiptapToolbar from './TiptapToolbar';
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
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class: `p-3`,
        style: `min-height: ${height}px; outline: none;`
      }
    }
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

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
    <div className={`border rounded overflow-hidden ${className}`}>
      {showToolbar && (
        <TiptapToolbar 
          editor={editor} 
          config={toolbar} 
          disabled={readOnly}
        />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;