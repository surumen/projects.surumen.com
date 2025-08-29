"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import { ColorPopover } from "../shared/ColorPopover"
import type { BootstrapColor } from "../shared/ColorSwatch"

export interface ColorHighlightPopoverProps {
  editor: Editor | null
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | 'default') => void
  tooltip?: string
}

/**
 * Highlight color popover component - specific implementation of ColorPopover
 */
export function ColorHighlightPopover(props: ColorHighlightPopoverProps) {
  return (
    <ColorPopover 
      {...props} 
      variant="highlight"
    />
  )
}

export default ColorHighlightPopover

// Re-export shared types  
export type { BootstrapColor } from "../shared/ColorSwatch"