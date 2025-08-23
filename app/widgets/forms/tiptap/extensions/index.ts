// Example custom extension - you can add your own here

import { Node } from '@tiptap/core';
import type { RawCommands } from '@tiptap/core';

// Example: Custom callout/alert box extension
export const CalloutExtension = Node.create({
  name: 'callout',
  
  group: 'block',
  
  content: 'block+',
  
  defining: true,
  
  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          return {
            'data-type': attributes.type,
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-callout': '', class: 'callout', ...HTMLAttributes }, 0];
  },
  
  addCommands() {
    return {
      setCallout: (attributes: { type: string }) => ({ commands }) => {
        return commands.wrapIn(this.name, attributes);
      },
    } as Partial<RawCommands>;
  },
});

// Export all custom extensions
export const customExtensions = {
  CalloutExtension
};