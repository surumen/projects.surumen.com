import React from 'react';
import { classNames } from '../utils/classNames';

export interface InputGroupPrefixProps {
  children: React.ReactNode;
  type?: 'text' | 'button';
  className?: string;
}

/**
 * InputGroupPrefix component - Prefix addon for InputGroup
 * 
 * Generates HTML structure:
 * 
 * For basic input groups:
 * <span class="input-group-text">{children}</span>
 * 
 * For merge variant (detects merge in parent automatically):
 * <div class="input-group-prepend input-group-text">{children}</div>
 * 
 * For button type:
 * <div class="input-group-prepend input-group-text">{children}</div>
 */
export const InputGroupPrefix: React.FC<InputGroupPrefixProps> = ({ 
  children, 
  type = 'text', 
  className 
}) => {
  // For merge variant or buttons, we need the prepend structure
  // We'll detect merge by checking if children contain icons (common pattern)
  // Or if type is button
  const shouldUsePrependStructure = type === 'button' || 
    React.isValidElement(children);
  
  if (shouldUsePrependStructure) {
    return (
      <div className={classNames('input-group-prepend input-group-text', className)}>
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

export default InputGroupPrefix;
