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
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Image } from "@tiptap/extension-image"

// --- Reuse Moses's Components ---
import { TooltipProvider } from "./components/tooltip"
import { TiptapToolbar } from "./components/toolbar"

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
  
  // Toolbar options
  variant?: 'full' | 'compact' | 'minimal'
  showToolbar?: boolean
  
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
  Image.configure({
    HTMLAttributes: {
      class: 'img-fluid rounded my-2',
    },
    inline: false,
    allowBase64: true,
  }),
  TextAlign.configure({ 
    types: ["heading", "paragraph"],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  TextStyle,
  Color,
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
  
  // Toolbar options
  variant = 'full',
  showToolbar = true,
  
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
          
          {/* Extracted Toolbar */}
          <TiptapToolbar 
            editor={editor}
            variant={variant}
            visible={showToolbar}
          />

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className="flex-grow-1 overflow-auto"
          />
          
        </EditorContext.Provider>
      </div>
    </TooltipProvider>
  )
}

export default Tiptap