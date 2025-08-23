// Predefined extension sets for different use cases

import StarterKit from '@tiptap/starter-kit';
import type { Extension } from '@tiptap/core';

export type ExtensionSet = 'minimal' | 'basic' | 'standard' | 'full';

export const extensionSets: Record<ExtensionSet, Extension[]> = {
  minimal: [
    StarterKit.configure({
      heading: {
        levels: [1, 2]
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    })
  ],
  
  basic: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    })
  ],
  
  standard: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6]
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    })
    // Additional extensions will be added here as we install them
  ],
  
  full: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6]
      },
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    })
    // Additional extensions will be added here as we install them
  ]
};

export const getExtensions = (
  extensionSet: ExtensionSet = 'basic',
  customExtensions: Extension[] = []
): Extension[] => {
  const baseExtensions = extensionSets[extensionSet] || extensionSets.basic;
  return [...baseExtensions, ...customExtensions];
};