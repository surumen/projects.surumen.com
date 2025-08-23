import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import { ToolbarConfig, getToolbarConfig, ToolbarItem, ToolbarGroupConfig } from './config/toolbarConfig';
import {
  // History
  ArrowCounterclockwise, ArrowClockwise,
  // Headings - trying different naming
  Type, TypeH1, TypeH2, TypeH3, Paragraph,
  // Text Formatting
  TypeBold, TypeItalic, TypeUnderline, TypeStrikethrough,
  // Script - if they exist
  // Subscript, Superscript,
  // Colors
  Palette, BucketFill,
  // Alignment
  TextLeft, TextCenter, TextRight, JustifyLeft,
  // Lists
  ListUl, ListOl,
  // Insert
  Link45deg, Image, Table, Hr,
  // Media & Special
  PlayBtnFill, Calculator, Quote,
  // Code
  Code, CodeSquare,
  // Tools
  Eraser, Fullscreen, Printer, TextParagraph
} from 'react-bootstrap-icons';

interface TiptapToolbarProps {
  editor: Editor;
  config: ToolbarConfig;
  disabled?: boolean;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor, config, disabled = false }) => {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const toolbarGroups = getToolbarConfig(config);

  // Heading dropdown options
  const headingOptions = [
    { level: 0, label: 'Paragraph' },
    { level: 1, label: 'Heading 1' },
    { level: 2, label: 'Heading 2' },
    { level: 3, label: 'Heading 3' },
    { level: 4, label: 'Heading 4' },
    { level: 5, label: 'Heading 5' },
    { level: 6, label: 'Heading 6' }
  ];

  const getCurrentHeading = () => {
    if (editor.isActive('paragraph')) return headingOptions[0];
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        return headingOptions[i];
      }
    }
    return headingOptions[0];
  };

  const renderToolbarItem = (item: ToolbarItem) => {
    // Icon mapping
    const getIcon = (item: ToolbarItem) => {
      switch (item) {
        case 'undo': return ArrowCounterclockwise;
        case 'redo': return ArrowClockwise;
        case 'bold': return TypeBold;
        case 'italic': return TypeItalic;
        case 'underline': return TypeUnderline;
        case 'strikethrough': return TypeStrikethrough;
        case 'subscript': return Code; // Fallback since Subscript may not exist
        case 'superscript': return Code; // Fallback since Superscript may not exist
        case 'textColor': return Palette;
        case 'highlightColor': return BucketFill;
        case 'alignLeft': return TextLeft;
        case 'alignCenter': return TextCenter;
        case 'alignRight': return TextRight;
        case 'alignJustify': return JustifyLeft;
        case 'indent': return TextRight; // Use text-right as fallback for indent
        case 'outdent': return TextLeft; // Use text-left as fallback for outdent  
        case 'bulletList': return ListUl;
        case 'orderedList': return ListOl;
        case 'link': return Link45deg;
        case 'unlink': return Link45deg;
        case 'image': return Image;
        case 'table': return Table;
        case 'hr': return Hr;
        case 'embed': return PlayBtnFill;
        case 'math': return Calculator;
        case 'blockquote': return Quote;
        case 'codeInline': return Code;
        case 'codeBlock': return CodeSquare;
        case 'clearFormatting': return Eraser;
        case 'fullscreen': return Fullscreen;
        case 'print': return Printer;
        case 'lineHeight': return TextParagraph;
        case 'paragraph': return Paragraph;
        default: return Code; // fallback
      }
    };
    
    const IconComponent = getIcon(item);
    
    const getButtonProps = () => {
      switch (item) {
        // History
        case 'undo':
          return {
            onClick: () => editor.chain().focus().undo().run(),
            isActive: false,
            disabled: !editor.can().undo(),
            title: 'Undo'
          };
        case 'redo':
          return {
            onClick: () => editor.chain().focus().redo().run(),
            isActive: false,
            disabled: !editor.can().redo(),
            title: 'Redo'
          };
          
        // Text Formatting
        case 'bold':
          return {
            onClick: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            title: 'Bold'
          };
        case 'italic':
          return {
            onClick: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            title: 'Italic'
          };
        case 'underline':
          return {
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive('underline'),
            title: 'Underline'
          };
        case 'strikethrough':
          return {
            onClick: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
            title: 'Strikethrough'
          };
          
        // Lists
        case 'bulletList':
          return {
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            title: 'Bullet List'
          };
        case 'orderedList':
          return {
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            title: 'Numbered List'
          };
          
        // Blocks
        case 'blockquote':
          return {
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
            title: 'Quote'
          };
        case 'codeBlock':
          return {
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive('codeBlock'),
            title: 'Code Block'
          };
          
        // Paragraph
        case 'paragraph':
          return {
            onClick: () => editor.chain().focus().setParagraph().run(),
            isActive: editor.isActive('paragraph'),
            title: 'Paragraph',
            useText: 'P'
          };
          
        // Not yet implemented - placeholder buttons
        case 'subscript':
        case 'superscript':
        case 'textColor':
        case 'highlightColor':
        case 'alignLeft':
        case 'alignCenter':
        case 'alignRight':
        case 'alignJustify':
        case 'indent':
        case 'outdent':
        case 'link':
        case 'unlink':
        case 'image':
        case 'table':
        case 'hr':
        case 'embed':
        case 'math':
        case 'codeInline':
        case 'clearFormatting':
        case 'fullscreen':
        case 'print':
        case 'lineHeight':
          return {
            onClick: () => console.log(`${item} not implemented yet`),
            isActive: false,
            disabled: true,
            title: `${item.charAt(0).toUpperCase() + item.slice(1)} (Coming Soon)`
          };
          
        default:
          return null;
      }
    };

    // Special handling for heading dropdown
    if (item === 'headingDropdown') {
      const currentHeading = getCurrentHeading();
      
      return (
        <div key={item} className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm btn-outline-secondary dropdown-toggle ${showHeadingDropdown ? 'show' : ''}`}
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            aria-expanded={showHeadingDropdown}
            disabled={disabled}
            title="Headings"
            style={{ minWidth: '110px' }}
          >
            {currentHeading.label}
          </button>
          
          <ul className={`dropdown-menu ${showHeadingDropdown ? 'show' : ''}`} aria-labelledby="headingDropdown">
            {headingOptions.map((option) => (
              <li key={option.level}>
                <button
                  type="button"
                  className={`dropdown-item ${
                    (option.level === 0 && editor.isActive('paragraph')) ||
                    (option.level > 0 && editor.isActive('heading', { level: option.level }))
                      ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (option.level === 0) {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      editor.chain().focus().toggleHeading({ level: option.level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                    }
                    setShowHeadingDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const props = getButtonProps();
    if (!props) return null;

    return (
      <button
        key={item}
        type="button"
        className={`btn btn-sm ${props.isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={props.onClick}
        disabled={disabled || props.disabled}
        title={props.title}
      >
        {props.useText ? (
          <span className="fw-bold">{props.useText}</span>
        ) : (
          <IconComponent size={16} />
        )}
      </button>
    );
  };

  const renderToolbarGroup = (group: ToolbarGroupConfig, groupIndex: number) => {
    return (
      <div 
        key={group.id}
        className="btn-group me-2 mb-1 flex-shrink-0" 
        role="group" 
        aria-label={group.label}
      >
        {group.items.map(item => renderToolbarItem(item))}
      </div>
    );
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showHeadingDropdown && !target.closest('.btn-group')) {
        setShowHeadingDropdown(false);
      }
    };
    
    if (showHeadingDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showHeadingDropdown]);

  return (
    <div className="btn-toolbar bg-light p-2 flex-wrap">
      {toolbarGroups.map((group, index) => renderToolbarGroup(group, index))}
    </div>
  );
};

export default TiptapToolbar;