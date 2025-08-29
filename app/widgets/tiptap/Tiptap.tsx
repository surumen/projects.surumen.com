"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import type { Extension } from "@tiptap/core"

// --- TipTap Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { HorizontalRule } from "@tiptap/extension-horizontal-rule"

// --- Reuse Moses's Components ---
import { ToolbarButton } from "./components/toolbar-button"
import { Dropdown } from "./components/dropdown"
import { TooltipProvider } from "./components/tooltip"
import { LinkPopover } from "./components/link-popover"
import { ColorHighlightPopover } from "./components/color-highlight-popover"

// --- Reuse Moses's Hooks ---
import { useMark } from "./hooks/useMark"
import { useTextAlign } from "./hooks/useTextAlign"
import { useUndoRedo } from "./hooks/useUndoRedo"
import { useBlockquote } from "./hooks/useBlockquote"
import { useCodeBlock } from "./hooks/useCodeBlock"
import { useHorizontalRule } from "./hooks/useHorizontalRule"
import { useHeadingDropdownMenu } from "./hooks/useHeadingDropdownMenu"
import { useListDropdownMenu } from "./hooks/useListDropdownMenu"

// --- Utils ---
import { cn } from "./utils"

/**
 * Props interface designed specifically for forms integration
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
  
  // Advanced
  extensions?: any[]
  autoFocus?: boolean
}

/**
 * Default extensions optimized for forms usage
 */
const getDefaultExtensions = (placeholder: string): any[] => [
  StarterKit.configure({
    horizontalRule: false, // Use custom HorizontalRule
    blockquote: {
      HTMLAttributes: {
        class: 'border-start border-primary border-4 ps-3 my-3 fst-italic text-body-secondary',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-body-secondary text-body px-1 py-0 rounded-1 font-monospace',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'bg-dark text-light p-3 rounded overflow-auto my-3 font-monospace',
      },
    },
  }),
  Placeholder.configure({
    placeholder,
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: 'my-4',
      style: 'border: none; border-top: 2px solid var(--bs-border-color);'
    },
  }),
  TextAlign.configure({ 
    types: ["heading", "paragraph"],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Typography,
  Superscript,
  Subscript,
]

/**
 * TipTap Editor Component - Designed for Forms Integration
 * 
 * A clean, controlled rich text editor built on TipTap that's optimized for use in forms.
 * Always controlled (requires value and onChange props).
 */
export function Tiptap({
  // Required props
  value,
  onChange = () => {}, // Default no-op function
  
  // Form events
  onBlur,
  onFocus,
  
  // Form field props
  name,
  id,
  placeholder = "Start typing...",
  disabled = false,
  readOnly = false,
  required = false,
  
  // Styling
  className,
  minHeight = "300px",
  
  // Advanced
  extensions: customExtensions,
  autoFocus = false,
}: TiptapProps) {
  
  // Create editor with form-optimized configuration
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    
    // Always use the controlled value
    content: value,
    
    // Use custom extensions or defaults
    extensions: customExtensions || getDefaultExtensions(placeholder),
    
    // Editor configuration
    editable: !disabled && !readOnly,
    autofocus: autoFocus,
    
    // Editor DOM attributes
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off", 
        autocapitalize: "off",
        class: "p-3 lh-base text-body fs-6 border-0 outline-0",
        style: `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight}; outline: none; font-family: var(--bs-font-sans-serif);`,
        'aria-label': placeholder,
        ...(id && { id: `${id}-editor` }),
        ...(required && { 'aria-required': 'true' }),
      },
    },

    // Form event handlers
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onBlur: ({ event }) => {
      onBlur?.(event)
    },
    onFocus: ({ event }) => {
      onFocus?.(event)
    },
  })

  // Sync external value changes with editor
  React.useEffect(() => {
    if (!editor || editor.getHTML() === value) return
    editor.commands.setContent(value)
  }, [editor, value])

  // Sync editable state
  React.useEffect(() => {
    if (!editor) return
    const shouldBeEditable = !disabled && !readOnly
    if (editor.isEditable !== shouldBeEditable) {
      editor.setEditable(shouldBeEditable)
    }
  }, [editor, disabled, readOnly])

  // Get toolbar hook data
  const headingDropdown = useHeadingDropdownMenu({ editor, levels: [1, 2, 3, 4, 5, 6] })
  const listDropdown = useListDropdownMenu({ editor, types: ["bulletList", "orderedList"] })

  // Loading state
  if (!editor) {
    return (
      <div className={cn(
        "position-relative d-flex flex-column bg-body border rounded",
        disabled && "opacity-75",
        className
      )}>
        <div 
          className="d-flex align-items-center justify-content-center text-secondary fs-6"
          style={{ height: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
        >
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={500}>
      <div 
        className={cn(
          "position-relative d-flex flex-column bg-body border rounded",
          disabled && "opacity-75",
          className
        )}
        {...(id && { 'data-field-id': id })}
        {...(name && { 'data-field-name': name })}
      >
        <EditorContext.Provider value={{ editor }}>
          
          {/* Focused Toolbar for Forms */}
          <div
            role="toolbar"
            aria-label="Text formatting toolbar"
            className="d-flex align-items-center justify-content-start gap-1 flex-wrap bg-light-subtle border-bottom px-2 py-1 rounded-top"
            style={{ zIndex: 1030 }}
          >
            
            {/* Undo/Redo */}
            <div role="group" className="d-flex align-items-center gap-1">
              <ToolbarButton 
                hook={useUndoRedo} 
                config={{ action: "undo" }} 
                tooltip="Undo"
              />
              <ToolbarButton 
                hook={useUndoRedo} 
                config={{ action: "redo" }} 
                tooltip="Redo"
              />
            </div>

            {/* Text Formatting */}
            <div role="group" className="d-flex align-items-center gap-1">
              {headingDropdown.isVisible && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <button 
                      type="button"
                      className="btn btn-sm btn-ghost-primary"
                    >
                      {headingDropdown.displayText}
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    {headingDropdown.items.map((item, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={item.onClick}
                        active={item.active}
                      >
                        {item.text}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Content>
                </Dropdown>
              )}
              
              <ToolbarButton hook={useMark} config={{ type: "bold" }} variant="toggle" tooltip="Bold" />
              <ToolbarButton hook={useMark} config={{ type: "italic" }} variant="toggle" tooltip="Italic" />
              <ToolbarButton hook={useMark} config={{ type: "underline" }} variant="toggle" tooltip="Underline" />
              <ToolbarButton hook={useMark} config={{ type: "strike" }} variant="toggle" tooltip="Strikethrough" />
            </div>

            {/* Lists & Alignment */}
            <div role="group" className="d-flex align-items-center gap-1">
              {listDropdown.isVisible && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <button 
                      type="button"
                      className="btn btn-sm btn-ghost-secondary"
                    >
                      {listDropdown.Icon ? 
                        React.createElement(listDropdown.Icon, { style: { width: '1rem', height: '1rem' } }) : 
                        listDropdown.displayText
                      }
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    {listDropdown.items.map((item, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={item.onClick}
                        active={item.active}
                        icon={item.icon as React.ComponentType<{ style?: React.CSSProperties }>}
                      >
                        {item.text}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Content>
                </Dropdown>
              )}
              
              <ToolbarButton hook={useTextAlign} config={{ align: "left" }} tooltip="Align left" />
              <ToolbarButton hook={useTextAlign} config={{ align: "center" }} tooltip="Align center" />
              <ToolbarButton hook={useTextAlign} config={{ align: "right" }} tooltip="Align right" />
            </div>

            {/* Links & Highlighting */}
            <div role="group" className="d-flex align-items-center gap-1">
              <LinkPopover />
              <ColorHighlightPopover tooltip="Highlight text" />
            </div>


            {/* Blocks */}
            <div role="group" className="d-flex align-items-center gap-1">
              <ToolbarButton hook={useBlockquote} variant="toggle" tooltip="Blockquote" />
              <ToolbarButton hook={useCodeBlock} variant="toggle" tooltip="Code block" />
              <ToolbarButton hook={useHorizontalRule} tooltip="Horizontal line" />
            </div>

            {/* Text Formatting */}
            <div role="group" className="d-flex align-items-center gap-1">
              <ToolbarButton hook={useMark} config={{ type: "code" }} variant="toggle" tooltip="Inline code" />
              <ToolbarButton hook={useMark} config={{ type: "superscript" }} variant="toggle" tooltip="Superscript" />
              <ToolbarButton hook={useMark} config={{ type: "subscript" }} variant="toggle" tooltip="Subscript" />
            </div>

          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className="flex-grow-1 overflow-auto"
          />
          
          {/* Hidden input for form submission if needed */}
          {name && (
            <input
              type="hidden"
              name={name}
              id={id}
              value={value}
              required={required}
            />
          )}
          
        </EditorContext.Provider>
      </div>
    </TooltipProvider>
  )
}

export default Tiptap