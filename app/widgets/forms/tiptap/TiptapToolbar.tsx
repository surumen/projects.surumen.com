import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import { 
  ToolbarConfig, 
  getToolbarConfig, 
  ToolbarItem, 
  ToolbarGroupConfig, 
  BUTTON_CONFIGS, 
  ButtonConfig 
} from './config/toolbarConfig';
import LinkModal from './components/LinkModal';
import ImageModal from './components/ImageModal';
import EmbedModal from './components/EmbedModal';
import {
  // History
  ArrowCounterclockwise, ArrowClockwise,
  // Text Formatting
  TypeBold, TypeItalic, TypeUnderline, TypeStrikethrough,
  // Colors
  Palette, BucketFill,
  // Alignment
  TextLeft, TextCenter, TextRight, JustifyLeft,
  // Indentation
  TextIndentLeft, TextIndentRight,
  // Lists
  ListUl, ListOl,
  // Insert
  Link45deg, Image, Table, Hr, PlayBtnFill, Calculator,
  // Code
  Code, CodeSquare,
  // Blocks
  Quote,
  // Tools
  Eraser, Fullscreen, TextParagraph
} from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

interface TiptapToolbarProps {
  editor: Editor;
  config: ToolbarConfig;
  disabled?: boolean;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor, config, disabled = false }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const toolbarGroups = getToolbarConfig(config);

  // Get icon component or text representation
  const getIcon = (iconName: string, size: number = 16) => {
    switch (iconName) {
      // History
      case 'bi-arrow-counterclockwise': return <ArrowCounterclockwise size={size} />;
      case 'bi-arrow-clockwise': return <ArrowClockwise size={size} />;
      // Text Formatting
      case 'bi-type-bold': return <TypeBold size={size} />;
      case 'bi-type-italic': return <TypeItalic size={size} />;
      case 'bi-type-underline': return <TypeUnderline size={size} />;
      case 'bi-type-strikethrough': return <TypeStrikethrough size={size} />;
      case 'subscript-text': return <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>X₂</span>;
      case 'superscript-text': return <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>X²</span>;
      // Colors
      case 'bi-palette': return <Palette size={size} />;
      case 'bi-paint-bucket': return <BucketFill size={size} />;
      // Alignment
      case 'bi-text-left': return <TextLeft size={size} />;
      case 'bi-text-center': return <TextCenter size={size} />;
      case 'bi-text-right': return <TextRight size={size} />;
      case 'bi-justify': return <JustifyLeft size={size} />;
      // Indentation
      case 'bi-indent': return <TextIndentRight size={size} />;
      case 'bi-outdent': return <TextIndentLeft size={size} />;
      // Lists
      case 'bi-list-ul': return <ListUl size={size} />;
      case 'bi-list-ol': return <ListOl size={size} />;
      // Insert
      case 'bi-link-45deg': return <Link45deg size={size} />;
      case 'bi-image': return <Image size={size} />;
      case 'bi-table': return <Table size={size} />;
      case 'bi-hr': return <Hr size={size} />;
      case 'bi-play-btn-fill': return <PlayBtnFill size={size} />;
      case 'bi-calculator': return <Calculator size={size} />;
      // Code
      case 'bi-code': return <Code size={size} />;
      case 'bi-code-square': return <CodeSquare size={size} />;
      // Blocks
      case 'bi-quote': return <Quote size={size} />;
      // Tools
      case 'bi-eraser': return <Eraser size={size} />;
      case 'bi-fullscreen': return <Fullscreen size={size} />;
      case 'line-height-text': return <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>1.5</span>;
      // Default
      default: return <TextParagraph size={size} />;
    }
  };

  // Check if button is active
  const isButtonActive = (buttonConfig: ButtonConfig): boolean => {
    if (!('activeCheck' in buttonConfig) || !buttonConfig.activeCheck) return false;
    
    if (typeof buttonConfig.activeCheck === 'string') {
      if (buttonConfig.activeCheck.includes('.')) {
        const [attr, prop] = buttonConfig.activeCheck.split('.');
        return !!editor.getAttributes(attr)[prop];
      }
      return editor.isActive(buttonConfig.activeCheck);
    } else if (typeof buttonConfig.activeCheck === 'object') {
      return editor.isActive(buttonConfig.activeCheck);
    }
    return false;
  };

  // Handle toggle controls
  const handleToggle = (buttonConfig: ButtonConfig) => () => {
    if (buttonConfig.controlType !== 'toggle') return;
    
    if ('params' in buttonConfig && buttonConfig.params) {
      (editor.chain().focus() as any)[buttonConfig.command](buttonConfig.params).run();
    } else {
      (editor.chain().focus() as any)[buttonConfig.command]().run();
    }
  };

  // Handle action controls
  const handleAction = (buttonConfig: ButtonConfig) => () => {
    if (buttonConfig.controlType !== 'action') return;

    // Special handling for undo/redo
    if (buttonConfig.command === 'undo' || buttonConfig.command === 'redo') {
      if (editor.can()[buttonConfig.command]()) {
        (editor.chain().focus() as any)[buttonConfig.command]().run();
      }
      return;
    }

    // Special handling for clear formatting
    if (buttonConfig.command === 'clearNodes') {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
      return;
    }

    // Special handling for text alignment
    if (buttonConfig.command === 'setTextAlign') {
      editor.chain().focus().setTextAlign(buttonConfig.params).run();
      return;
    }

    // Regular action handling
    if ('params' in buttonConfig && buttonConfig.params) {
      (editor.chain().focus() as any)[buttonConfig.command](buttonConfig.params).run();
    } else {
      (editor.chain().focus() as any)[buttonConfig.command]().run();
    }
  };

  // Handle dropdown selection
  const handleDropdownSelect = (buttonConfig: ButtonConfig, value: any) => {
    if (buttonConfig.controlType !== 'dropdown') return;
    
    setActiveDropdown(null);
    buttonConfig.onSelect(editor, value);
  };

  // Handle dialog opening
  const handleDialog = (buttonConfig: ButtonConfig) => () => {
    if (buttonConfig.controlType !== 'dialog') return;
    
    // Handle different dialog types
    if (buttonConfig.title === 'Insert Link') {
      setActiveModal('link');
    } else if (buttonConfig.title === 'Insert Image') {
      setActiveModal('image');
    } else if (buttonConfig.title === 'Embed Media') {
      setActiveModal('embed');
    } else {
      // For other dialogs, call the original openDialog method for now
      buttonConfig.openDialog(editor);
    }
  };

  // Render toggle button
  const renderToggleButton = (item: ToolbarItem, buttonConfig: ButtonConfig) => {
    if (buttonConfig.controlType !== 'toggle') return null;

    const isActive = isButtonActive(buttonConfig);
    const isDisabled = disabled || buttonConfig.disabled;

    return (
      <button
        key={item}
        type="button"
        className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={handleToggle(buttonConfig)}
        disabled={isDisabled}
        title={buttonConfig.title}
      >
        {getIcon(buttonConfig.icon)}
      </button>
    );
  };

  // Render action button
  const renderActionButton = (item: ToolbarItem, buttonConfig: ButtonConfig) => {
    if (buttonConfig.controlType !== 'action') return null;

    let isDisabled = disabled || buttonConfig.disabled;
    
    // Special disabled logic for history buttons
    if (buttonConfig.command === 'undo') {
      isDisabled = isDisabled || !editor.can().undo();
    } else if (buttonConfig.command === 'redo') {
      isDisabled = isDisabled || !editor.can().redo();
    }

    return (
      <button
        key={item}
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleAction(buttonConfig)}
        disabled={isDisabled}
        title={buttonConfig.title}
      >
        {getIcon(buttonConfig.icon)}
      </button>
    );
  };

  // Render dropdown button
  const renderDropdownButton = (item: ToolbarItem, buttonConfig: ButtonConfig) => {
    if (buttonConfig.controlType !== 'dropdown') return null;

    const isOpen = activeDropdown === item;
    const currentValue = buttonConfig.getCurrentValue(editor);
    const options = buttonConfig.getOptions(editor);

    // Show icon if currentValue is empty, otherwise show text
    const showIcon = currentValue === '';
    const buttonContent = showIcon ? getIcon(buttonConfig.icon) : currentValue;

    return (
      <div key={item} className="btn-group" role="group">
        <Button
          type="button"
          variant={''}
          className={`btn btn-sm btn-outline-secondary dropdown-toggle`}
          onClick={() => setActiveDropdown(isOpen ? null : item)}
          aria-expanded={isOpen}
          disabled={disabled || buttonConfig.disabled}
          title={buttonConfig.title}
          style={showIcon ? {} : { minWidth: '120px' }}
        >
          {buttonContent}
        </Button>
        
        <ul className={`dropdown-menu mt-6 ${isOpen ? 'show' : ''}`}>
          {options.map((option, index) => (
            <li key={index}>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center"
                onClick={() => handleDropdownSelect(buttonConfig, option.value)}
              >
                {option.color && (
                  <span 
                    className="d-inline-block me-2"
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: option.color,
                      border: '1px solid #dee2e6',
                      borderRadius: '2px'
                    }}
                  />
                )}
                {option.display || option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render dialog button
  const renderDialogButton = (item: ToolbarItem, buttonConfig: ButtonConfig) => {
    if (buttonConfig.controlType !== 'dialog') return null;

    return (
      <button
        key={item}
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleDialog(buttonConfig)}
        disabled={disabled || buttonConfig.disabled}
        title={buttonConfig.title}
      >
        {getIcon(buttonConfig.icon)}
      </button>
    );
  };

  // Render toolbar item based on control type
  const renderToolbarItem = (item: ToolbarItem) => {
    const buttonConfig = BUTTON_CONFIGS[item];
    if (!buttonConfig) return null;

    switch (buttonConfig.controlType) {
      case 'toggle':
        return renderToggleButton(item, buttonConfig);
      case 'action':
        return renderActionButton(item, buttonConfig);
      case 'dropdown':
        return renderDropdownButton(item, buttonConfig);
      case 'dialog':
        return renderDialogButton(item, buttonConfig);
      default:
        return null;
    }
  };

  // Render toolbar group
  const renderToolbarGroup = (group: ToolbarGroupConfig) => {
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
      if (activeDropdown && !target.closest('.btn-group')) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <div className="btn-toolbar bg-light p-2 flex-wrap">
      {toolbarGroups.map(group => renderToolbarGroup(group))}
      
      {/* Modals */}
      <LinkModal 
        isOpen={activeModal === 'link'}
        onClose={() => setActiveModal(null)}
        editor={editor}
      />
      <ImageModal 
        isOpen={activeModal === 'image'}
        onClose={() => setActiveModal(null)}
        editor={editor}
      />
      <EmbedModal 
        isOpen={activeModal === 'embed'}
        onClose={() => setActiveModal(null)}
        editor={editor}
      />
    </div>
  );
};

export default TiptapToolbar;
