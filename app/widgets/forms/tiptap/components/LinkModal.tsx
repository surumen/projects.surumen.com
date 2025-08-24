import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import ToolbarModal from './ToolbarModal';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, editor }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  // When modal opens, check if we're editing an existing link
  useEffect(() => {
    if (isOpen) {
      const { href } = editor.getAttributes('link');
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      
      setUrl(href || 'https://');
      setText(selectedText || '');
    } else {
      // Reset when modal closes
      setUrl('');
      setText('');
    }
  }, [isOpen, editor]);

  const handleSubmit = () => {
    if (!url || url === 'https://') {
      return;
    }

    // If no text is selected and user provided text, insert new text with link
    if (!editor.state.selection.empty) {
      // Update existing selection with link
      editor.chain().focus().setLink({ href: url }).run();
    } else if (text) {
      // Insert new text with link
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      // Just insert the URL as both text and link
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    }

    onClose();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  const isEditing = editor.isActive('link');

  return (
    <ToolbarModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Link' : 'Insert Link'}
      onSubmit={handleSubmit}
      submitText={isEditing ? 'Update Link' : 'Insert Link'}
    >
      <div className="mb-3">
        <label htmlFor="link-url" className="form-label">
          URL <span className="text-danger">*</span>
        </label>
        <input
          id="link-url"
          type="url"
          className="form-control"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label htmlFor="link-text" className="form-label">
          Link Text {!editor.state.selection.empty && '(optional)'}
        </label>
        <input
          id="link-text"
          type="text"
          className="form-control"
          placeholder="Link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!editor.state.selection.empty && (
          <div className="form-text">
            Leave empty to keep current selection
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mb-3">
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemoveLink}
          >
            Remove Link
          </button>
        </div>
      )}
    </ToolbarModal>
  );
};

export default LinkModal;
