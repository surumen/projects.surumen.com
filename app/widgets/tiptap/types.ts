import type { Editor } from "@tiptap/react"
import type React from "react"

/**
 * Props interface for the main Tiptap component
 */
export interface TiptapProps {
  // Form integration (required - always controlled)
  value: string
  onChange?: (html: string) => void
  
  // Form events
  onBlur?: (event?: FocusEvent) => void
  onFocus?: (event?: FocusEvent) => void
  
  // Form field props
  name?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  
  // Styling
  className?: string
  minHeight?: string | number
  
  // Toolbar options
  variant?: 'full' | 'compact' | 'minimal'
  showToolbar?: boolean
  
  // Advanced
  extensions?: any[]
  autoFocus?: boolean
}

/**
 * Definition for a single toolbar item
 */
export interface ToolbarItemDefinition {
  type?: 'button' | 'dropdown' | 'popover' | 'separator' | 'custom'
  hook?: (config: any) => any
  config?: Record<string, any>
  variant?: 'default' | 'toggle'
  tooltip?: string
  label?: string
  component?: React.ComponentType<any>
  props?: Record<string, any>
  visible?: boolean | ((editor: Editor | null) => boolean)
}

/**
 * Group of toolbar items
 */
export interface ToolbarGroup {
  name: string
  items: string[]
}

/**
 * Configuration for a toolbar variant
 */
export interface ToolbarVariantConfig {
  groups: ToolbarGroup[]
}

/**
 * Registry of all available toolbar items
 */
export type ToolbarItemRegistry = Record<string, ToolbarItemDefinition>

/**
 * Registry of all available toolbar variants
 */
export type ToolbarVariantRegistry = Record<string, ToolbarVariantConfig>

/**
 * Props for ToolbarItem component
 */
export interface ToolbarItemProps {
  editor: Editor | null
  definition: ToolbarItemDefinition
  className?: string
}

/**
 * Props for ToolbarRenderer component
 */
export interface ToolbarRendererProps {
  editor: Editor | null
  variant: string
  customConfig?: ToolbarVariantConfig
  className?: string
}

/**
 * Props for TiptapToolbar component
 */
export interface TiptapToolbarProps {
  editor: Editor | null
  variant?: 'full' | 'compact' | 'minimal'
  customConfig?: ToolbarVariantConfig
  className?: string
  visible?: boolean
}

/**
 * Configuration for editor commands
 */
export interface EditorCommandConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
  shortcutKeys?: string
  canExecute: (editor: Editor) => boolean
  isActive: (editor: Editor) => boolean
  executeCommand: (editor: Editor) => boolean
  label: string
}

/**
 * Bootstrap color types
 */
export type BootstrapColor = 
  | "primary"
  | "secondary" 
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"

/**
 * Color popover configuration
 */
export interface UseColorPopoverConfig {
  editor: Editor | null
  variant: 'text' | 'highlight'
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | null) => void
}

/**
 * Color popover props
 */
export interface ColorPopoverProps extends Omit<UseColorPopoverConfig, 'variant'> {
  variant: 'text' | 'highlight'
  tooltip?: string
}

/**
 * Color swatch props
 */
export interface ColorSwatchProps {
  color: BootstrapColor | 'default'
  variant: 'text' | 'highlight'
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
}
