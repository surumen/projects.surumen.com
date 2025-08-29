import type { ToolbarItemRegistry } from './types'

// --- Import hooks ---
import { useMark } from '../hooks/useMark'
import { useTextAlign } from '../hooks/useTextAlign'
import { useUndoRedo } from '../hooks/useUndoRedo'
import { useBlockquote } from '../hooks/useBlockquote'
import { useCodeBlock } from '../hooks/useCodeBlock'
import { useHorizontalRule } from '../hooks/useHorizontalRule'
import { useImageUpload } from '../hooks/useImageUpload'
import { useHeadingDropdownMenu } from '../hooks/useHeadingDropdownMenu'
import { useListDropdownMenu } from '../hooks/useListDropdownMenu'

// --- Import components ---
import { LinkPopover } from '../components/link-popover'
import { ColorPopover } from '../components/color-popover/ColorPopover'

/**
 * Registry of all available toolbar items
 * Each item is defined once with its configuration
 */
export const TOOLBAR_ITEMS: ToolbarItemRegistry = {
  // History actions
  undo: {
    type: 'button',
    hook: useUndoRedo,
    config: { action: 'undo' },
    tooltip: 'Undo'
  },

  redo: {
    type: 'button',
    hook: useUndoRedo,
    config: { action: 'redo' },
    tooltip: 'Redo'
  },

  // Text formatting marks
  bold: {
    type: 'button',
    hook: useMark,
    config: { type: 'bold' },
    variant: 'toggle',
    tooltip: 'Bold'
  },

  italic: {
    type: 'button',
    hook: useMark,
    config: { type: 'italic' },
    variant: 'toggle',
    tooltip: 'Italic'
  },

  underline: {
    type: 'button',
    hook: useMark,
    config: { type: 'underline' },
    variant: 'toggle',
    tooltip: 'Underline'
  },

  strike: {
    type: 'button',
    hook: useMark,
    config: { type: 'strike' },
    variant: 'toggle',
    tooltip: 'Strikethrough'
  },

  code: {
    type: 'button',
    hook: useMark,
    config: { type: 'code' },
    variant: 'toggle',
    tooltip: 'Inline code'
  },

  superscript: {
    type: 'button',
    hook: useMark,
    config: { type: 'superscript' },
    variant: 'toggle',
    tooltip: 'Superscript'
  },

  subscript: {
    type: 'button',
    hook: useMark,
    config: { type: 'subscript' },
    variant: 'toggle',
    tooltip: 'Subscript'
  },

  // Dropdowns
  headings: {
    type: 'dropdown',
    hook: useHeadingDropdownMenu,
    config: { levels: [1, 2, 3, 4, 5, 6] },
    label: 'Headings'
  },

  lists: {
    type: 'dropdown',
    hook: useListDropdownMenu,
    config: { types: ['bulletList', 'orderedList'] },
  },

  // Text alignment
  alignLeft: {
    type: 'button',
    hook: useTextAlign,
    config: { align: 'left' },
    tooltip: 'Align left'
  },

  alignCenter: {
    type: 'button',
    hook: useTextAlign,
    config: { align: 'center' },
    tooltip: 'Align center'
  },

  alignRight: {
    type: 'button',
    hook: useTextAlign,
    config: { align: 'right' },
    tooltip: 'Align right'
  },

  // Popovers
  linkPopover: {
    type: 'popover',
    component: LinkPopover,
    props: {}
  },

  colorText: {
    type: 'popover',
    component: ColorPopover,
    props: { variant: 'text', tooltip: 'Text color' }
  },

  colorHighlight: {
    type: 'popover',
    component: ColorPopover,
    props: { variant: 'highlight', tooltip: 'Highlight text' }
  },

  // Block elements
  blockquote: {
    type: 'button',
    hook: useBlockquote,
    variant: 'toggle',
    tooltip: 'Blockquote'
  },

  codeBlock: {
    type: 'button',
    hook: useCodeBlock,
    variant: 'toggle',
    tooltip: 'Code block'
  },

  horizontalRule: {
    type: 'button',
    hook: useHorizontalRule,
    tooltip: 'Horizontal line'
  },

  imageUpload: {
    type: 'button',
    hook: useImageUpload,
    tooltip: 'Insert Image'
  },

  // Separator
  separator: {
    type: 'separator'
  }
}
