// Predefined extension sets for different use cases

import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import type { Extension } from '@tiptap/core';

export type ExtensionSet = 'minimal' | 'basic' | 'standard' | 'full';

export const extensionSets: Record<ExtensionSet, any[]> = {
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
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right']
    }),
    HorizontalRule
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
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify']
    }),
    HorizontalRule,
    Subscript,
    Superscript,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary'
      }
    })
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
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify']
    }),
    HorizontalRule,
    Subscript,
    Superscript,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary'
      }
    }),
    TextStyle,
    Color.configure({
      types: ['textStyle']
    }),
    Highlight.configure({
      multicolor: true
    }),
    // Table support with Bootstrap integration
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'table table-sm', // Use regular Bootstrap table class
      },
    }),
    TableRow,
    TableHeader,
    TableCell
  ]
};

export const getExtensions = (
  extensionSet: ExtensionSet = 'basic',
  customExtensions: any[] = []
): any[] => {
  const baseExtensions = extensionSets[extensionSet] || extensionSets.basic;
  return [...baseExtensions, ...customExtensions];
};