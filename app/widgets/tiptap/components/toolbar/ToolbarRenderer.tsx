"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Components ---
import { ToolbarItem } from "./ToolbarItem"

// --- Configuration ---
import { TOOLBAR_ITEMS, TOOLBAR_VARIANTS } from "../../config"
import type { ToolbarRendererProps } from "../../config/types"

// --- Utils ---
import { cn } from "../../utils"

/**
 * ToolbarRenderer Component
 * 
 * Renders a complete toolbar based on variant configuration
 */
export const ToolbarRenderer: React.FC<ToolbarRendererProps> = ({
  editor,
  variant,
  customConfig,
  className
}) => {
  // Get configuration for the variant
  const config = React.useMemo(() => {
    if (customConfig) return customConfig
    
    const variantConfig = TOOLBAR_VARIANTS[variant]
    if (!variantConfig) {
      console.warn(`Unknown toolbar variant: ${variant}`)
      return TOOLBAR_VARIANTS.full // Fallback to full
    }
    
    return variantConfig
  }, [variant, customConfig])

  if (!editor || !config) {
    return null
  }

  return (
    <div
      role="toolbar"
      aria-label="Text formatting toolbar"
      className={cn(
        "d-flex align-items-center justify-content-start gap-1 flex-wrap bg-light-subtle border-bottom px-2 py-1 rounded-top",
        className
      )}
      style={{ zIndex: 1030 }}
    >
      {config.groups.map((group, groupIndex) => (
        <React.Fragment key={group.name}>
          {/* Add separator between groups (except first group) */}
          {/*{groupIndex > 0 && <div className="vr mx-1" aria-hidden="true" />}*/}
          
          {/* Render group items */}
          <div 
            role="group" 
            className="d-flex align-items-center gap-1"
            aria-label={`${group.name} tools`}
          >
            {group.items.map((itemKey) => {
              const itemDefinition = TOOLBAR_ITEMS[itemKey]
              
              if (!itemDefinition) {
                console.warn(`Unknown toolbar item: ${itemKey}`)
                return null
              }
              
              return (
                <ToolbarItem
                  key={itemKey}
                  editor={editor}
                  definition={itemDefinition}
                />
              )
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default ToolbarRenderer
