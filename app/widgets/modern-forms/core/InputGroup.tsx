import React, { Children, cloneElement, isValidElement } from 'react';
import { classNames } from '../utils/classNames';
import { InputGroupProvider } from './Field';
import { generateFieldId } from '../utils/fieldHelpers';

export interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string; // Label for the input group
  helpText?: string; // Help text for the input group
}

/**
 * InputGroup component - Container for inputs with prefix/suffix addons
 * 
 * Generates HTML structure:
 * <div class="mb-3"> (if label or helpText)
 *   <label class="form-label">Label</label> (if label)
 *   <div class="input-group [variants]">
 *     {children}
 *   </div>
 *   <span class="form-text">Help text</span> (if helpText)
 * </div>
 * 
 * Supports Bootstrap variants via className:
 * - input-group-merge (merge borders)
 * - input-group-flush (flush styling)
 * - input-group-borderless (no borders)  
 * - input-group-light (light theme)
 * - input-group-hover-light (hover effects)
 */
export const InputGroup: React.FC<InputGroupProps> = ({ 
  children, 
  className,
  label,
  helpText 
}) => {
  // Find Field component to get its name for label association
  let fieldName = '';
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props.name) {
      fieldName = child.props.name;
    }
  });

  const fieldId = fieldName ? generateFieldId(fieldName) : undefined;

  // Render label if provided
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label className="form-label" htmlFor={fieldId}>
        {label}
      </label>
    );
  };

  // Render help text
  const renderHelpText = () => {
    if (!helpText) return null;
    
    return (
      <div className="form-text">
        {helpText}
      </div>
    );
  };

  const inputGroup = (
    <InputGroupProvider value={true}>
      <div className={classNames('input-group', className)}>
        {children}
      </div>
    </InputGroupProvider>
  );

  // If we have label or helpText, wrap in field container
  if (label || helpText) {
    return (
      <div className="mb-3">
        {renderLabel()}
        {inputGroup}
        {renderHelpText()}
      </div>
    );
  }

  // Otherwise return just the input group
  return inputGroup;
};

export default InputGroup;
