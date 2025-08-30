// app/widgets/components/table/hooks/useTableSelectionState.ts
// Minimal hook for external consumers who need selection state

import { useMemo } from 'react'
import type { SelectionConfig } from '../types'

/**
 * Minimal selection state for external consumers
 * Use this when you need selection info outside the table (e.g., bulk actions)
 */
export interface MinimalSelectionState<T> {
  selectedItems: T[]
  selectedCount: number
  hasSelection: boolean
}

/**
 * Extract minimal selection state from selection config
 * This is what external consumers typically need for bulk actions
 */
export const useTableSelectionState = <T,>(
  selection?: SelectionConfig<T>
): MinimalSelectionState<T> => {
  return useMemo(() => {
    const selectedItems = selection?.selected || []
    return {
      selectedItems,
      selectedCount: selectedItems.length,
      hasSelection: selectedItems.length > 0
    }
  }, [selection?.selected])
}