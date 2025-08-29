
// Core Tiptap Component
export { Tiptap as default } from './Tiptap'
export { Tiptap } from './Tiptap'
export type { TiptapProps } from './Tiptap'

// Toolbar Components
export { TiptapToolbar } from './components/toolbar'
export type { TiptapToolbarProps } from './components/toolbar'
export { ToolbarRenderer } from './components/toolbar-renderer'
export { ToolbarItem } from './components/toolbar-item'

// Configuration
export { TOOLBAR_ITEMS, TOOLBAR_VARIANTS } from './config'
export type { 
  ToolbarItemDefinition, 
  ToolbarVariantConfig, 
  ToolbarItemRegistry,
  ToolbarVariantRegistry
} from './config'

// Rich Text Field Validators (TODO: Create this)
// export { RichTextFieldValidators } from './validators/RichTextFieldValidators'

// Re-export components for advanced usage
export * from './components/toolbar-button'
export * from './components/dropdown'
export * from './components/popover'
export * from './components/tooltip'
export * from './components/link-popover'
export * from './components/color-highlight-popover'
export * from './components/color-text-popover'

// Re-export hooks for advanced customization
export * from './hooks/useTiptapEditor'
export * from './hooks/useEditorCommand'
export * from './hooks/useMark'
export * from './hooks/useColorText'

// Re-export lib
export * from './utils'
