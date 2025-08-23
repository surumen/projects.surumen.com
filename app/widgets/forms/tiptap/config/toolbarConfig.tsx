// Clean toolbar configuration - source of truth

import React from 'react';
import type { Editor } from '@tiptap/core';

export type ControlType = 'toggle' | 'action' | 'dropdown' | 'dialog';

export type ToolbarItem = 
  // History
  | 'undo' | 'redo'
  // Text Structure
  | 'headingDropdown'
  // Text Formatting
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'subscript' | 'superscript'
  // Colors
  | 'textColor' | 'highlightColor'
  // Alignment
  | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify'
  // Indentation
  | 'indent' | 'outdent'
  // Lists
  | 'bulletList' | 'orderedList'
  // Insert
  | 'link' | 'image' | 'table' | 'hr' | 'embed' | 'math'
  // Code
  | 'codeInline' | 'codeBlock'
  // Blocks
  | 'blockquote'
  // Tools
  | 'clearFormatting' | 'fullscreen' | 'lineHeight';

export interface DropdownOption {
  value: any;
  label?: string;
  display?: React.ReactNode;
  color?: string;  // For color options
}

interface BaseButtonConfig {
  controlType: ControlType;
  icon: string;
  title: string;
  activeCheck?: string | object;
  disabled?: boolean;
}

interface ToggleConfig extends BaseButtonConfig {
  controlType: 'toggle';
  command: string;
  activeCheck: string | object;
}

interface ActionConfig extends BaseButtonConfig {
  controlType: 'action';
  command: string;
  params?: any;
}

interface DropdownConfig extends BaseButtonConfig {
  controlType: 'dropdown';
  getOptions: (editor: Editor) => DropdownOption[];
  getCurrentValue: (editor: Editor) => string;
  onSelect: (editor: Editor, value: any) => void;
}

interface DialogConfig extends BaseButtonConfig {
  controlType: 'dialog';
  openDialog: (editor: Editor) => void;
}

export type ButtonConfig = ToggleConfig | ActionConfig | DropdownConfig | DialogConfig;

export interface ToolbarGroupConfig {
  id: string;
  label: string;
  items: ToolbarItem[];
}

export type ToolbarConfig = 
  | 'minimal' 
  | 'basic' 
  | 'standard' 
  | 'full' 
  | ToolbarGroupConfig[];

// Button configurations - single source of truth
export const BUTTON_CONFIGS: Record<ToolbarItem, ButtonConfig> = {
  // History
  undo: {
    controlType: 'action',
    command: 'undo',
    icon: 'bi-arrow-counterclockwise',
    title: 'Undo'
  },
  redo: {
    controlType: 'action',
    command: 'redo',
    icon: 'bi-arrow-clockwise', 
    title: 'Redo'
  },

  // Text Structure
  headingDropdown: {
    controlType: 'dropdown',
    icon: 'bi-type-h1',
    title: 'Text Style',
    getOptions: () => [
      { value: null, display: <p className="mb-0">Paragraph</p> },
      { value: 1, display: <h1 className="mb-0">Heading 1</h1> },
      { value: 2, display: <h2 className="mb-0">Heading 2</h2> },
      { value: 3, display: <h3 className="mb-0">Heading 3</h3> },
      { value: 4, display: <h4 className="mb-0">Heading 4</h4> },
      { value: 5, display: <h5 className="mb-0">Heading 5</h5> },
      { value: 6, display: <h6 className="mb-0">Heading 6</h6> }
    ],
    getCurrentValue: (editor) => {
      if (editor.isActive('paragraph')) return 'Paragraph';
      for (let i = 1; i <= 6; i++) {
        if (editor.isActive('heading', { level: i })) {
          return `Heading ${i}`;
        }
      }
      return 'Paragraph';
    },
    onSelect: (editor, value) => {
      if (value === null) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level: value }).run();
      }
    }
  },

  // Text Formatting
  bold: {
    controlType: 'toggle',
    command: 'toggleBold',
    activeCheck: 'bold',
    icon: 'bi-type-bold',
    title: 'Bold'
  },
  italic: {
    controlType: 'toggle',
    command: 'toggleItalic',
    activeCheck: 'italic',
    icon: 'bi-type-italic',
    title: 'Italic'
  },
  underline: {
    controlType: 'toggle',
    command: 'toggleUnderline',
    activeCheck: 'underline',
    icon: 'bi-type-underline',
    title: 'Underline'
  },
  strikethrough: {
    controlType: 'toggle',
    command: 'toggleStrike',
    activeCheck: 'strike',
    icon: 'bi-type-strikethrough',
    title: 'Strikethrough'
  },
  subscript: {
    controlType: 'toggle',
    command: 'toggleSubscript',
    activeCheck: 'subscript',
    icon: 'subscript-text', // Will render as "X₂"
    title: 'Subscript'
  },
  superscript: {
    controlType: 'toggle',
    command: 'toggleSuperscript',
    activeCheck: 'superscript',
    icon: 'superscript-text', // Will render as "X²"
    title: 'Superscript'
  },

  // Colors
  textColor: {
    controlType: 'dropdown',
    icon: 'bi-palette',
    title: 'Text Color',
    getOptions: () => [
      { value: '#000000', label: 'Black', color: '#000000' },
      { value: '#dc3545', label: 'Red', color: '#dc3545' },
      { value: '#0d6efd', label: 'Blue', color: '#0d6efd' },
      { value: '#198754', label: 'Green', color: '#198754' },
      { value: '#ffc107', label: 'Yellow', color: '#ffc107' },
      { value: '#6f42c1', label: 'Purple', color: '#6f42c1' }
    ],
    getCurrentValue: () => '', // Return empty string to show icon only
    onSelect: (editor, value) => {
      editor.chain().focus().setColor(value).run();
    }
  },
  highlightColor: {
    controlType: 'dropdown',
    icon: 'bi-paint-bucket',
    title: 'Highlight Color',
    getOptions: () => [
      { value: '#ffff00', label: 'Yellow', color: '#ffff00' },
      { value: '#00ff00', label: 'Green', color: '#00ff00' },
      { value: '#00ffff', label: 'Cyan', color: '#00ffff' },
      { value: '#ff69b4', label: 'Pink', color: '#ff69b4' },
      { value: '#ffa500', label: 'Orange', color: '#ffa500' }
    ],
    getCurrentValue: () => '', // Return empty string to show icon only
    onSelect: (editor, value) => {
      editor.chain().focus().setHighlight({ color: value }).run();
    }
  },

  // Alignment
  alignLeft: {
    controlType: 'action',
    command: 'setTextAlign',
    params: 'left',
    icon: 'bi-text-left',
    title: 'Align Left'
  },
  alignCenter: {
    controlType: 'action',
    command: 'setTextAlign',
    params: 'center',
    icon: 'bi-text-center',
    title: 'Align Center'
  },
  alignRight: {
    controlType: 'action',
    command: 'setTextAlign',
    params: 'right',
    icon: 'bi-text-right',
    title: 'Align Right'
  },
  alignJustify: {
    controlType: 'action',
    command: 'setTextAlign',
    params: 'justify',
    icon: 'bi-justify',
    title: 'Justify'
  },

  // Indentation
  indent: {
    controlType: 'action',
    command: 'indent',
    icon: 'bi-indent',
    title: 'Indent'
  },
  outdent: {
    controlType: 'action',
    command: 'outdent',
    icon: 'bi-outdent',
    title: 'Outdent'
  },

  // Lists
  bulletList: {
    controlType: 'toggle',
    command: 'toggleBulletList',
    activeCheck: 'bulletList',
    icon: 'bi-list-ul',
    title: 'Bullet List'
  },
  orderedList: {
    controlType: 'toggle',
    command: 'toggleOrderedList',
    activeCheck: 'orderedList',
    icon: 'bi-list-ol',
    title: 'Numbered List'
  },

  // Insert
  link: {
    controlType: 'dialog',
    icon: 'bi-link-45deg',
    title: 'Insert Link',
    openDialog: (editor) => {
      // This will be handled by the toolbar component to open Bootstrap modal
    }
  },
  image: {
    controlType: 'dialog',
    icon: 'bi-image',
    title: 'Insert Image',
    openDialog: (editor) => {
      // This will be handled by the toolbar component to open Bootstrap modal
    }
  },
  table: {
    controlType: 'dropdown',
    icon: 'bi-table',
    title: 'Insert Table',
    getOptions: () => [
      { value: { rows: 2, cols: 2 }, label: '2x2 Table' },
      { value: { rows: 3, cols: 3 }, label: '3x3 Table' },
      { value: { rows: 4, cols: 4 }, label: '4x4 Table' },
      { value: { rows: 5, cols: 5 }, label: '5x5 Table' }
    ],
    getCurrentValue: () => 'Table',
    onSelect: (editor, value) => {
      // TODO: Implement table insertion
      console.log('Insert table:', value);
    }
  },
  hr: {
    controlType: 'action',
    command: 'setHorizontalRule',
    icon: 'bi-hr',
    title: 'Horizontal Rule'
  },
  embed: {
    controlType: 'dialog',
    icon: 'bi-play-btn-fill',
    title: 'Embed Media',
    openDialog: (editor) => {
      // This will be handled by the toolbar component to open Bootstrap modal
    }
  },
  math: {
    controlType: 'dialog',
    icon: 'bi-calculator',
    title: 'Insert Math',
    openDialog: (editor) => {
      // TODO: Implement math dialog
      alert('Math functionality coming soon!');
    }
  },

  // Code
  codeInline: {
    controlType: 'toggle',
    command: 'toggleCode',
    activeCheck: 'code',
    icon: 'bi-code',
    title: 'Inline Code'
  },
  codeBlock: {
    controlType: 'toggle',
    command: 'toggleCodeBlock',
    activeCheck: 'codeBlock',
    icon: 'bi-code-square',
    title: 'Code Block'
  },

  // Blocks
  blockquote: {
    controlType: 'toggle',
    command: 'toggleBlockquote',
    activeCheck: 'blockquote',
    icon: 'bi-quote',
    title: 'Quote'
  },

  // Tools
  clearFormatting: {
    controlType: 'action',
    command: 'clearNodes',
    icon: 'bi-eraser',
    title: 'Clear Formatting'
  },
  fullscreen: {
    controlType: 'toggle',
    command: 'toggleFullscreen',
    activeCheck: 'fullscreen',
    icon: 'bi-fullscreen',
    title: 'Fullscreen'
  },
  lineHeight: {
    controlType: 'dropdown',
    icon: 'line-height-text', // Will render as text
    title: 'Line Height',
    getOptions: () => [
      { value: 1.0, label: '1.0' },
      { value: 1.15, label: '1.15' },
      { value: 1.5, label: '1.5' },
      { value: 2.0, label: '2.0' },
      { value: 2.5, label: '2.5' }
    ],
    getCurrentValue: () => '1.15', // TODO: Get actual line height
    onSelect: (editor, value) => {
      // TODO: Implement line height
      console.log('Set line height:', value);
    }
  }
};

// Predefined toolbar configurations
export const toolbarPresets: Record<string, ToolbarGroupConfig[]> = {
  minimal: [
    { id: 'formatting', label: 'Text Formatting', items: ['bold', 'italic', 'link'] }
  ],
  
  basic: [
    { id: 'formatting', label: 'Text Formatting', items: ['bold', 'italic', 'underline'] },
    { id: 'headings', label: 'Headings', items: ['headingDropdown'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] }
  ],
  
  standard: [
    { id: 'history', label: 'History', items: ['undo', 'redo'] },
    { id: 'headings', label: 'Text Style', items: ['headingDropdown'] },
    { id: 'formatting', label: 'Formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
    { id: 'alignment', label: 'Alignment', items: ['alignLeft', 'alignCenter', 'alignRight'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] },
    { id: 'insert', label: 'Insert', items: ['link', 'blockquote'] }
  ],
  
  full: [
    { id: 'history', label: 'History', items: ['undo', 'redo'] },
    { id: 'headings', label: 'Text Style', items: ['headingDropdown'] },
    { id: 'formatting', label: 'Formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
    { id: 'script', label: 'Script', items: ['subscript', 'superscript'] },
    { id: 'colors', label: 'Colors', items: ['textColor', 'highlightColor'] },
    { id: 'alignment', label: 'Alignment', items: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] },
    { id: 'indentation', label: 'Indentation', items: ['outdent', 'indent'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] },
    { id: 'insert', label: 'Insert', items: ['link', 'image', 'table', 'hr'] },
    { id: 'media', label: 'Media', items: ['embed', 'math'] },
    { id: 'code', label: 'Code', items: ['codeInline', 'codeBlock'] },
    { id: 'blocks', label: 'Blocks', items: ['blockquote'] },
    { id: 'tools', label: 'Tools', items: ['clearFormatting', 'fullscreen', 'lineHeight'] }
  ]
};

export const getToolbarConfig = (config: ToolbarConfig): ToolbarGroupConfig[] => {
  if (typeof config === 'string') {
    return toolbarPresets[config] || toolbarPresets.basic;
  }
  
  if (Array.isArray(config)) {
    return config;
  }
  
  return toolbarPresets.basic;
};
