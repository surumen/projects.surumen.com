
// Core Tiptap Component
export { Tiptap as default } from './Tiptap'
export { Tiptap } from './Tiptap'
export type { TiptapProps } from './Tiptap'

// Toolbar Components
export { TiptapToolbar, ToolbarItem, ToolbarRenderer } from './components/toolbar'
export type { TiptapToolbarProps } from './components/toolbar'

// Configuration
export { TOOLBAR_ITEMS, TOOLBAR_VARIANTS } from './config'
export type { 
  ToolbarItemDefinition, 
  ToolbarVariantConfig, 
  ToolbarItemRegistry,
  ToolbarVariantRegistry
} from './config'


export * from './hooks/useTiptapEditor'
export * from './hooks/useEditorCommand'
export * from './hooks/useMark'
export * from './hooks/useColorText'

export * from './utils'
