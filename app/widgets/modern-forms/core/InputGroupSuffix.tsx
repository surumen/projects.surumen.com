import React from 'react';
import { classNames } from '../utils/classNames';

export interface InputGroupSuffixProps {
  children: React.ReactNode;
  type?: 'text' | 'button';
  className?: string;
}

/**
 * InputGroupSuffix component - Suffix addon for InputGroup
 * 
 * Generates HTML structure:
 * 
 * For basic input groups:
 * <span class="input-group-text">{children}</span>
 * 
 * For merge variant (detects merge in parent automatically):
 * <div class="input-group-append input-group-text">{children}</div>
 * 
 * For button type:
 * <div class="input-group-append input-group-text">{children}</div>
 */
export const InputGroupSuffix: React.FC<InputGroupSuffixProps> = ({ 
  children, 
  type = 'text', 
  className 
}) => {
  // For merge variant or buttons, we need the append structure
  const shouldUseAppendStructure = type === 'button' || 
    React.isValidElement(children);
  
  if (shouldUseAppendStructure) {
    return (
      <div className={classNames('input-group-append input-group-text', className)}>
        {children}
      </div>
    );
  }

  // Basic text addon
  return (
    <span className={classNames('input-group-text', className)}>
      {children}
    </span>
  );
};

export default InputGroupSuffix;
