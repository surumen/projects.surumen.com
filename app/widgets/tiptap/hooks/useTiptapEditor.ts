"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"

/**
 * Hook that provides access to a Tiptap editor instance.
 * Simplified version with better TypeScript support.
 */
export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
  editorState?: Editor["state"]
  canCommand?: Editor["can"]
} {
  const { editor: coreEditor } = useCurrentEditor()
  const mainEditor = React.useMemo(
    () => providedEditor || coreEditor,
    [providedEditor, coreEditor]
  )

  const editorState = useEditorState({
    editor: mainEditor,
    selector(context) {
      if (!context.editor) {
        return {
          editor: null,
          editorState: undefined,
          canCommand: undefined,
        }
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      }
    },
  })

  return editorState || { editor: null }
}
