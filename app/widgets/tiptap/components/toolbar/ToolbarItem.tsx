"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Components ---
import { ToolbarButton } from "./ToolbarButton"
import { Dropdown } from "../../../components/dropdown"

// --- Types ---
import type { ToolbarItemProps } from "../../types"

// --- Utils ---
import { cn } from "../../utils"

/**
 * ToolbarItem Component
 * 
 * Universal adapter that renders different types of toolbar items
 * based on their definition from the registry
 */
export const ToolbarItem: React.FC<ToolbarItemProps> = ({ 
  editor, 
  definition, 
  className 
}) => {
  // Handle conditional visibility
  if (definition.visible === false) return null
  if (typeof definition.visible === 'function' && !definition.visible(editor)) return null
  
  const commonProps = {
    className,
    'data-toolbar-item': true
  }
  
  switch (definition.type) {
    case 'button':
    case undefined: // Default type
      if (!definition.hook) {
        console.warn('Toolbar item missing hook:', definition)
        return null
      }
      
      return (
        <ToolbarButton 
          hook={definition.hook}
          config={{ editor, ...definition.config }}
          variant={definition.variant || 'default'}
          tooltip={definition.tooltip || ''}
          editor={editor}
          {...commonProps}
        />
      )
    
    case 'dropdown':
      if (!definition.hook) {
        console.warn('Dropdown toolbar item missing hook:', definition)
        return null
      }
      
      const dropdownHook = definition.hook({ editor, ...definition.config })
      
      if (!dropdownHook.isVisible) return null
      
      return (
        <Dropdown>
          <Dropdown.Trigger>
            <button 
              type="button" 
              className={cn("btn btn-sm btn-ghost-primary", className)}
            >
              {definition.label}
              {dropdownHook.Icon && (
                <dropdownHook.Icon style={{ width: '1rem', height: '1rem' }} />
              )}
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {dropdownHook.items?.map((item: any, index: number) => (
              <Dropdown.Item
                key={index}
                onClick={item.onClick}
                active={item.active}
                icon={item.icon}
              >
                {item.text}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      )
    
    case 'popover':
      if (!definition.component) {
        console.warn('Popover toolbar item missing component:', definition)
        return null
      }
      
      const PopoverComponent = definition.component
      return (
        <PopoverComponent 
          editor={editor}
          {...definition.props}
          {...commonProps}
        />
      )
    
    case 'separator':
      return <div className="vr mx-1" aria-hidden="true" />
    
    case 'custom':
      if (!definition.component) {
        console.warn('Custom toolbar item missing component:', definition)
        return null
      }
      
      const CustomComponent = definition.component
      return (
        <CustomComponent 
          editor={editor}
          {...definition.props}
          {...commonProps}
        />
      )
    
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown toolbar item type: ${definition.type}`)
      }
      return null
  }
}

export default ToolbarItem
