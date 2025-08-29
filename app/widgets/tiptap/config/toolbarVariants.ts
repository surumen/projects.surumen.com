import type { ToolbarVariantRegistry } from './types'

/**
 * Registry of toolbar variant configurations
 * Each variant defines which groups and items to display
 */
export const TOOLBAR_VARIANTS: ToolbarVariantRegistry = {
  minimal: {
    groups: [
      {
        name: 'formatting',
        items: ['bold', 'italic', 'underline']
      }
    ]
  },

  compact: {
    groups: [
      {
        name: 'history',
        items: ['undo', 'redo']
      },
      {
        name: 'formatting',
        items: ['headings', 'bold', 'italic', 'underline']
      },
      {
        name: 'lists',
        items: ['lists']
      },
      {
        name: 'blocks',
        items: ['blockquote', 'codeBlock', 'imageUpload']
      },
      {
        name: 'links',
        items: ['linkPopover', 'colorText', 'colorHighlight']
      }
    ]
  },

  full: {
    groups: [
      {
        name: 'history',
        items: ['undo', 'redo']
      },
      {
        name: 'formatting',
        items: ['headings', 'bold', 'italic', 'underline', 'strike']
      },
      {
        name: 'lists',
        items: ['lists', 'alignLeft', 'alignCenter', 'alignRight']
      },
      {
        name: 'advanced',
        items: ['linkPopover', 'colorText', 'colorHighlight']
      },
      {
        name: 'blocks',
        items: ['blockquote', 'codeBlock', 'horizontalRule', 'imageUpload']
      },
      {
        name: 'textStyles',
        items: ['code', 'superscript', 'subscript']
      }
    ]
  }
}
