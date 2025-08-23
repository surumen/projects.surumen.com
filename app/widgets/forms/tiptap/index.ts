// Barrel exports for tiptap module

export { default as TiptapEditor } from './TiptapEditor';
export { default as TiptapToolbar } from './TiptapToolbar';

export type { TiptapEditorProps } from './TiptapEditor';
export type { 
  ToolbarConfig, 
  ToolbarItem, 
  ToolbarGroupConfig, 
  ControlType,
  ButtonConfig,
  DropdownOption 
} from './config/toolbarConfig';

export { toolbarPresets, getToolbarConfig, BUTTON_CONFIGS } from './config/toolbarConfig';
export { extensionSets, getExtensions } from './config/extensionSets';
export { customExtensions } from './extensions';