// app/widgets/components/table/utils/childrenExtraction.ts
// Utility for extracting column and state configurations from React children

import { ReactNode, Children, isValidElement } from 'react'
import type { ColumnConfig } from '../types'

/**
 * Result of extracting table children components
 */
export interface ChildExtractionResult<T> {
  columns: ColumnConfig<T>[]
  loadingState: {
    show: boolean
    rowCount: number
    children?: ReactNode
  } | null
  emptyState: {
    show: boolean
    children?: ReactNode
  } | null
}

/**
 * Component types for identification during extraction
 */
export interface ComponentTypes {
  Column: any
  LoadingState: any
  EmptyState: any
}

/**
 * Extracts column configurations and state components from React children
 * This handles the complex React.Children traversal and component identification
 * 
 * @param children - React children to extract from
 * @param componentTypes - Component constructors for type checking
 * @returns Extracted columns and state configurations
 */
export const extractTableChildren = <T>(
  children: ReactNode,
  componentTypes: ComponentTypes
): ChildExtractionResult<T> => {
  const columns: ColumnConfig<T>[] = []
  let loadingState: ChildExtractionResult<T>['loadingState'] = null
  let emptyState: ChildExtractionResult<T>['emptyState'] = null

  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) return

    // Extract column configurations
    if (child.type === componentTypes.Column) {
      columns.push({
        key: child.key || `col-${index}`,
        index,
        render: child.props.children,
        headerRender: child.props.headerRender,
        headerProps: {
          header: child.props.header,
          align: child.props.align || 'start',
          width: child.props.width,
          minWidth: child.props.minWidth,
          maxWidth: child.props.maxWidth,
          sortable: child.props.sortable || false,
          sticky: child.props.sticky || false,
          className: child.props.className || '',
          sortKey: child.props.sortKey
        },
        visible: child.props.visible !== false
      })
    }

    // Extract loading state configuration
    if (child.type === componentTypes.LoadingState) {
      loadingState = {
        show: child.props.show || false,
        rowCount: child.props.rowCount || 5,
        children: child.props.children
      }
    }

    // Extract empty state configuration
    if (child.type === componentTypes.EmptyState) {
      emptyState = {
        show: child.props.show || false,
        children: child.props.children
      }
    }
  })

  return { columns, loadingState, emptyState }
}
