// app/widgets/components/table/types/selection.ts
// Selection state and configuration types

import { ReactNode } from 'react'
import type { CheckboxProps } from './columns'

/**
 * Selection mode options
 */
export type SelectionMode = 'none' | 'single' | 'multiple'

/**
 * Selection configuration
 */
export interface SelectionConfig<T = any> {
  /** Selection mode */
  mode: SelectionMode
  /** Key to identify items */
  keyBy?: keyof T | ((item: T) => string | number)
  /** Initially selected items */
  defaultSelected?: T[]
  /** Controlled selected items */
  selected?: T[]
  /** Selection change callback */
  onSelectionChange?: (selected: T[]) => void
  /** Whether to preserve selection across data changes */
  preserveSelection?: boolean
  /** Maximum number of items that can be selected */
  maxSelection?: number
  /** Whether to show selection checkboxes */
  showCheckboxes?: boolean
}

/**
 * Selection state returned by useTableSelection
 */
export interface SelectionState<T = any> {
  /** Currently selected items */
  selectedItems: T[]
  /** Number of selected items */
  selectedCount: number
  /** Whether any items are selected */
  hasSelected: boolean
  /** Whether all items are selected */
  isAllSelected: boolean
  /** Whether some (but not all) items are selected */
  isSomeSelected: boolean
  
  /** Selection actions */
  selectAll: () => void
  clearSelection: () => void
  toggleAll: () => void
  toggleItem: (item: T) => void
  selectItem: (item: T) => void
  deselectItem: (item: T) => void
  selectItems: (items: T[]) => void
  
  /** Selection helpers */
  isSelected: (item: T) => boolean
  getItemKey: (item: T) => string | number
  
  /** Props generators for UI components */
  getSelectAllProps: () => CheckboxProps
  getItemProps: (item: T) => CheckboxProps
}

/**
 * Selection change event
 */
export interface SelectionChangeEvent<T = any> {
  /** Newly selected items */
  selectedItems: T[]
  /** Previously selected items */
  previousSelection: T[]
  /** Items that were added to selection */
  addedItems: T[]
  /** Items that were removed from selection */
  removedItems: T[]
  /** The action that triggered this change */
  action: SelectionAction
}

/**
 * Selection action types
 */
export type SelectionAction = 
  | 'select-all'
  | 'clear-all' 
  | 'toggle-all'
  | 'select-item'
  | 'deselect-item'
  | 'toggle-item'
  | 'select-multiple'

/**
 * Bulk action configuration
 */
export interface BulkActionConfig<T = any> {
  /** Action label */
  label: string
  /** Action icon */
  icon?: ReactNode
  /** Action handler */
  onAction: (selectedItems: T[]) => void | Promise<void>
  /** Whether action is destructive */
  destructive?: boolean
  /** Whether action is disabled */
  disabled?: boolean | ((selectedItems: T[]) => boolean)
  /** Confirmation message for destructive actions */
  confirmMessage?: string
  /** Custom CSS classes */
  className?: string
}

/**
 * Selection toolbar props
 */
export interface SelectionToolbarProps<T = any> {
  /** Selected items */
  selectedItems: T[]
  /** Selection count */
  selectedCount: number
  /** Available bulk actions */
  actions: BulkActionConfig<T>[]
  /** Clear selection callback */
  onClearSelection: () => void
  /** Whether to show selection count */
  showCount?: boolean
  /** Custom CSS classes */
  className?: string
}
