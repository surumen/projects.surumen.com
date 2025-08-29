"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import { ColorPopover } from "../shared/ColorPopover"
import type { BootstrapColor } from "../shared/ColorSwatch"

export interface ColorTextPopoverProps {
  editor: Editor | null
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | 'default') => void
  tooltip?: string
}

/**
 * Text color popover component - specific implementation of ColorPopover
 */
export function ColorTextPopover(props: ColorTextPopoverProps) {
  return (
    <ColorPopover 
      {...props} 
      variant="text"
    />
  )
}

export default ColorTextPopover

// Re-export shared types
export type { BootstrapColor } from "../shared/ColorSwatch"