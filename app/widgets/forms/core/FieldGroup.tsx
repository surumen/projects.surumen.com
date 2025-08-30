import React, { Children, cloneElement, isValidElement } from 'react';
import { FieldGroupProps } from '../types/field';
import { classNames, getColumnClasses } from '../utils/classNames';

/**
 * FieldGroup component - Layout container for fields in the same row
 * 
 * Generates HTML structure using Bootstrap grid:
 * <div class="row">
 *   <div class="col-6 mb-3">
 *     <Field ... />
 *   </div>
 *   <div class="col-6 mb-3"> 
 *     <Field ... />
 *   </div>
 * </div>
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({ 
  children, 
  className 
}) => {
  // Process children to wrap them in column divs
  const processedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    // Check if child has columns prop (Field component)
    const columns = (child.props as any).columns;
    
    if (columns) {
      // Wrap in column div - the Field component keeps its own mb-3
      return (
        <div className={getColumnClasses(columns)}>
          {child}
        </div>
      );
    }

    // If no columns specified, give full width
    return (
      <div className="col-12">
        {child}
      </div>
    );
  });

  return (
    <div className={classNames('row', className)}>
      {processedChildren}
    </div>
  );
};

export default FieldGroup;
