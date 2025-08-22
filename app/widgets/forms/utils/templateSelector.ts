// app/widgets/forms/utils/templateSelector.ts
// Logic to determine which template to use for a field

import type { FieldConfig } from '@/types/forms/advanced';
import type { FieldTemplate } from '@/types/forms/styling';

/**
 * Determine which template should be used for a field
 */
export const selectFieldTemplate = (field: FieldConfig): FieldTemplate => {
  // If explicitly specified in styling, use that
  if (field.styling?.inputGroup) {
    return 'input-group';
  }
  
  // Handle different field types
  switch (field.type) {
    case 'switch':
      return 'switch';
      
    case 'input':
    case 'textarea':
    case 'select':
      return 'basic';
      
    case 'date':
    case 'file':
    case 'tags':
      // These will use their specialized components
      // but this helps with template detection
      return 'basic';
      
    default:
      return 'basic';
  }
};

/**
 * Check if a field should use input group template
 */
export const shouldUseInputGroup = (field: FieldConfig): boolean => {
  return !!(field.styling?.inputGroup?.prepend || field.styling?.inputGroup?.append);
};

/**
 * Check if a field should use inline layout
 */
export const shouldUseInlineLayout = (field: FieldConfig): boolean => {
  return !!(field.styling?.inline);
};

/**
 * Check if a field has custom styling that requires template override
 */
export const hasCustomStyling = (field: FieldConfig): boolean => {
  const { styling } = field;
  if (!styling) return false;
  
  return !!(
    styling.variant && styling.variant !== 'default' ||
    styling.size && styling.size !== 'md' ||
    styling.inputGroup ||
    styling.inline ||
    styling.customClasses
  );
};
