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
  | 'clearFormatting' | 'fullscreen';

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
      // Semantic Colors
      { value: '#0061FE', label: 'Blue', color: '#0061FE' },
      { value: '#2d7a02', label: 'Green', color: '#2d7a02' },
      { value: '#007891', label: 'Ocean', color: '#007891' },
      { value: '#9B6400', label: 'Gold', color: '#9B6400' },
      { value: '#9B0032', label: 'Crimson', color: '#9B0032' },
      // Accent Colors
      { value: '#BE4B0A', label: 'Rust', color: '#BE4B0A' },
      { value: '#0F503C', label: 'Canopy', color: '#0F503C' },
      { value: '#283750', label: 'Navy', color: '#283750' },
      { value: '#78286E', label: 'Plum', color: '#78286E' },
      { value: '#CD2F7B', label: 'Magenta', color: '#CD2F7B' },
      { value: '#14C8EB', label: 'Zen', color: '#14C8EB' },
      { value: '#FA551E', label: 'Sunset', color: '#FA551E' },
      { value: '#FF8C19', label: 'Tangerine', color: '#FF8C19' },
      { value: '#B4DC19', label: 'Lime', color: '#B4DC19' },
      // Neutral Colors
      { value: '#1A1918', label: 'Black', color: '#1A1918' },
      { value: '#67615A', label: 'Graphite', color: '#67615A' },
      { value: '#F7F5F2', label: 'Coconut', color: '#F7F5F2' }
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
      // Soft Accent Colors (with 15% opacity for subtle highlights)
      { value: 'rgba(190, 75, 10, 0.15)', label: 'Rust Soft', color: 'rgba(190, 75, 10, 0.15)' },
      { value: 'rgba(15, 80, 60, 0.15)', label: 'Canopy Soft', color: 'rgba(15, 80, 60, 0.15)' },
      { value: 'rgba(40, 55, 80, 0.15)', label: 'Navy Soft', color: 'rgba(40, 55, 80, 0.15)' },
      { value: 'rgba(120, 40, 110, 0.15)', label: 'Plum Soft', color: 'rgba(120, 40, 110, 0.15)' },
      { value: 'rgba(205, 47, 123, 0.15)', label: 'Magenta Soft', color: 'rgba(205, 47, 123, 0.15)' },
      { value: 'rgba(20, 200, 235, 0.15)', label: 'Zen Soft', color: 'rgba(20, 200, 235, 0.15)' },
      { value: 'rgba(250, 85, 30, 0.15)', label: 'Sunset Soft', color: 'rgba(250, 85, 30, 0.15)' },
      { value: 'rgba(255, 140, 25, 0.15)', label: 'Tangerine Soft', color: 'rgba(255, 140, 25, 0.15)' },
      { value: 'rgba(180, 220, 25, 0.15)', label: 'Lime Soft', color: 'rgba(180, 220, 25, 0.15)' },
      { value: 'rgba(180, 200, 225, 0.15)', label: 'Cloud Soft', color: 'rgba(180, 200, 225, 0.15)' },
      { value: 'rgba(200, 175, 240, 0.15)', label: 'Orchid Soft', color: 'rgba(200, 175, 240, 0.15)' },
      { value: 'rgba(255, 175, 165, 0.15)', label: 'Pink Soft', color: 'rgba(255, 175, 165, 0.15)' },
      { value: 'rgba(250, 210, 75, 0.15)', label: 'Banana Soft', color: 'rgba(250, 210, 75, 0.15)' }
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
    controlType: 'dialog',
    icon: 'bi-table',
    title: 'Insert Table',
    openDialog: (editor) => {
      // This will be handled by the toolbar component to open Bootstrap modal
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
    { id: 'alignment', label: 'Alignment', items: ['alignLeft', 'alignCenter', 'alignRight'] },
    { id: 'indentation', label: 'Indentation', items: ['outdent', 'indent'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] },
    { id: 'insert', label: 'Insert', items: ['link', 'image', 'table', 'hr'] },
    { id: 'media', label: 'Media', items: ['embed', 'math'] },
    { id: 'code', label: 'Code', items: ['codeInline', 'codeBlock'] },
    { id: 'blocks', label: 'Blocks', items: ['blockquote'] },
    { id: 'tools', label: 'Tools', items: ['clearFormatting', 'fullscreen'] }
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
