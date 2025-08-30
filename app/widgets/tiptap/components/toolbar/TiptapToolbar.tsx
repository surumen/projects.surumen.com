"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Components ---
import { ToolbarRenderer } from "./ToolbarRenderer"

// --- Types ---
import type { TiptapToolbarProps } from "../../types"

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
