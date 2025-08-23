// Toolbar configuration types and presets

export type ToolbarItem = 
  | 'undo' | 'redo'
  | 'headingDropdown' | 'paragraph'
  | 'bold' | 'italic' | 'underline' | 'strikethrough'
  | 'subscript' | 'superscript'
  | 'textColor' | 'highlightColor'
  | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify'
  | 'indent' | 'outdent'
  | 'bulletList' | 'orderedList'
  | 'link' | 'unlink' | 'image' | 'table' | 'hr'
  | 'embed' | 'math' | 'blockquote'
  | 'codeInline' | 'codeBlock'
  | 'clearFormatting' | 'fullscreen' | 'print'
  | 'lineHeight';

export interface ToolbarItemConfig {
  id: ToolbarItem;
  icon: string;
  title: string;
  disabled?: boolean;
}

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

// Icon mapping for toolbar items
export const toolbarItemIcons: Record<ToolbarItem, string> = {
  // History
  undo: 'bi-arrow-90deg-left',
  redo: 'bi-arrow-90deg-right',
  
  // Headings
  headingDropdown: 'bi-type-h1',
  paragraph: 'bi-paragraph',
  
  // Text Formatting
  bold: 'bi-type-bold',
  italic: 'bi-type-italic',
  underline: 'bi-type-underline',
  strikethrough: 'bi-type-strikethrough',
  
  // Script
  subscript: 'bi-subscript',
  superscript: 'bi-superscript',
  
  // Colors
  textColor: 'bi-palette',
  highlightColor: 'bi-paint-bucket',
  
  // Alignment
  alignLeft: 'bi-text-left',
  alignCenter: 'bi-text-center',
  alignRight: 'bi-text-right',
  alignJustify: 'bi-justify',
  
  // Indentation
  indent: 'bi-indent-increase',
  outdent: 'bi-indent-decrease',
  
  // Lists
  bulletList: 'bi-list-ul',
  orderedList: 'bi-list-ol',
  
  // Insert
  link: 'bi-link-45deg',
  unlink: 'bi-link-45deg',
  image: 'bi-image',
  table: 'bi-table',
  hr: 'bi-hr',
  
  // Media & Special
  embed: 'bi-play-btn-fill',
  math: 'bi-calculator',
  blockquote: 'bi-quote',
  
  // Code
  codeInline: 'bi-code',
  codeBlock: 'bi-code-square',
  
  // Tools
  clearFormatting: 'bi-eraser',
  fullscreen: 'bi-fullscreen',
  print: 'bi-printer',
  lineHeight: 'bi-text-paragraph'
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
    { id: 'history', label: 'Undo Redo', items: ['undo', 'redo'] },
    { id: 'headings', label: 'Headings', items: ['headingDropdown'] },
    { id: 'formatting', label: 'Text Formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
    { id: 'alignment', label: 'Alignment', items: ['alignLeft', 'alignCenter', 'alignRight'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] },
    { id: 'insert', label: 'Insert', items: ['link', 'blockquote'] }
  ],
  
  full: [
    { id: 'history', label: 'Undo Redo', items: ['undo', 'redo'] },
    { id: 'headings', label: 'Headings', items: ['headingDropdown'] },
    { id: 'formatting', label: 'Text Formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
    { id: 'script', label: 'Script', items: ['subscript', 'superscript'] },
    { id: 'color', label: 'Colors', items: ['textColor', 'highlightColor'] },
    { id: 'alignment', label: 'Alignment', items: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] },
    { id: 'indent', label: 'Indentation', items: ['outdent', 'indent'] },
    { id: 'lists', label: 'Lists', items: ['bulletList', 'orderedList'] },
    { id: 'insert', label: 'Insert', items: ['link', 'image', 'table', 'hr'] },
    { id: 'media', label: 'Media', items: ['embed', 'math'] },
    { id: 'blocks', label: 'Blocks', items: ['blockquote', 'codeBlock'] },
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