// app/widgets/forms/utils/templateHelpers.ts
// Helper functions for template rendering

import React from 'react';
import type { InputGroupAddon } from '@/types/forms/styling';

/**
 * Render input group addon content (icon, text, or custom content)
 */
export const renderAddon = (addon: InputGroupAddon): React.ReactNode => {
  if (addon.icon) {
    const IconComponent = addon.icon;
    const defaultProps = { size: 16 };
    const iconProps = { ...defaultProps, ...addon.iconProps };
    return React.createElement(IconComponent, iconProps);
  }
  
  if (addon.text) {
    return addon.text;
  }
  
  if (addon.content) {
    return addon.content;
  }
  
  return null;
};

/**
 * Generate unique field ID
 */
export const generateFieldId = (fieldName: string, prefix: string = 'field'): string => {
  return `${prefix}_${fieldName}`;
};

/**
 * Build aria-describedby attribute value
 */
export const buildAriaDescribedBy = (fieldName: string, hasHelpText: boolean, hasError: boolean): string | undefined => {
  const ids: string[] = [];
  
  if (hasHelpText) {
    ids.push(`${fieldName}_help`);
  }
  
  if (hasError) {
    ids.push(`${fieldName}_error`);
  }
  
  return ids.length > 0 ? ids.join(' ') : undefined;
};

/**
 * Check if field should show "(Optional)" text
 */
export const shouldShowOptionalText = (field: { required?: boolean }): boolean => {
  return !field.required;
};

/**
 * Get field placeholder with fallback
 */
export const getFieldPlaceholder = (field: { placeholder?: string; label?: string; type?: string }): string => {
  if (field.placeholder) {
    return field.placeholder;
  }
  
  // Generate default placeholder based on field type
  switch (field.type) {
    case 'select':
      return '— select —';
    case 'textarea':
      return `Enter ${field.label?.toLowerCase() || 'text'}...`;
    case 'input':
    default:
      return `Enter ${field.label?.toLowerCase() || 'value'}...`;
  }
};

/**
 * Validate and sanitize field value
 */
export const sanitizeFieldValue = (value: any, fieldType: string): any => {
  if (value === null || value === undefined) {
    return '';
  }
  
  switch (fieldType) {
    case 'switch':
      return Boolean(value);
    case 'select':
    case 'input':
    case 'textarea':
    default:
      return String(value);
  }
};

/**
 * Check if field state indicates loading/validating
 */
export const isFieldValidating = (field: { asyncValidate?: any[] }, isValidating?: boolean): boolean => {
  return !!(field.asyncValidate && field.asyncValidate.length > 0 && isValidating);
};

/**
 * Get validation state classes
 */
export const getValidationStateClasses = (hasError: boolean, touched: boolean): string => {
  if (!touched) return '';
  return hasError ? 'is-invalid' : 'is-valid';
};

/**
 * Generate form control props common to all input types
 */
export const getCommonControlProps = (field: any, value: any, onChange: Function, onBlur: Function) => {
  return {
    id: generateFieldId(field.name),
    name: field.name,
    value: sanitizeFieldValue(value, field.type),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const newValue = field.type === 'switch' ? (e.target as HTMLInputElement).checked : e.target.value;
      onChange(newValue);
    },
    onBlur,
    disabled: field.readOnly,
    required: field.required,
    placeholder: getFieldPlaceholder(field),
    'aria-invalid': false, // This will be set by template based on error state
    'aria-describedby': '' // This will be set by template based on help text and errors
  };
};
