import type { Editor } from "@tiptap/react"
import type React from "react"

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
