"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Components ---
import { ToolbarRenderer } from "../toolbar-renderer"

// --- Types ---
import type { ToolbarVariantConfig } from "../../config/types"

export interface TiptapToolbarProps {
  /**
   * The Tiptap editor instance
   */
  editor: Editor | null
  /**
   * Toolbar variant - controls which tools are displayed
   */
  variant?: 'full' | 'compact' | 'minimal'
  /**
   * Custom toolbar configuration (overrides variant)
   */
  customConfig?: ToolbarVariantConfig
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to show the toolbar
   */
  visible?: boolean
}

/**
 * TiptapToolbar Component - Configuration-based toolbar for the Tiptap editor
 * 
 * Provides three built-in variants:
 * - 'full': All toolbar options (default)
 * - 'compact': Essential formatting without advanced features  
 * - 'minimal': Only basic text formatting (bold, italic, underline)
 * 
 * Also supports custom configurations for maximum flexibility
 */
export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  variant = 'full',
  customConfig,
  className,
  visible = true
}) => {
  if (!visible || !editor) {
    return null
  }

  return (
    <ToolbarRenderer
      editor={editor}
      variant={variant}
      customConfig={customConfig}
      className={className}
    />
  )
}

export default TiptapToolbar
