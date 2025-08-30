"use client"

import React from 'react';
import { FieldProps } from '../../forms/types/field';
import { useFormContext } from '../../forms/core/Form';
import { useField } from '../../../hooks/forms/useField';
import {
  generateFieldId,
  getDefaultFieldValue
} from '../../forms/utils/fieldHelpers';
import { classNames } from '../../forms/utils/classNames';
import { Tiptap } from '../../tiptap/Tiptap';

/**
 * Rich Text Field Props - extends your existing FieldProps interface
 */
export interface RichTextFieldProps extends Omit<FieldProps, 'type' | 'rows'> {
  // Rich text specific props
  minHeight?: string | number;
  extensions?: any[];
  // Toolbar options
  variant?: 'full' | 'compact' | 'minimal';
  showToolbar?: boolean;
}

/**
 * RichTextField Component - Complete form field for rich text editing
 * 
 * A complete form field component that integrates TipTap with your existing form system.
 * Provides the same API as your Field component but with rich text editing capabilities.
 * 
 * Features:
 * - Full form integration with useField and useFormContext
 * - Bootstrap styling and validation display  
 * - Accessibility support
 * - Rich text validation
 * - Drop-in replacement for <Field type="textarea">
 */
export const RichTextField: React.FC<RichTextFieldProps> = (props) => {
  const {
    name,
    label,
    defaultValue,
    value: controlledValue,
    required = false,
    disabled = false,
    readOnly = false,
    error,
    placeholder = "Start typing...",
    helpText,
    autoFocus = false,
    className,
    minHeight = "200px",
    extensions,
    variant = 'full',
    showToolbar = true,
    updateOn = 'blur',
    validators = [],
    asyncValidators = [],
    deps = [],
    transform,
    parse,
    onChange,
    onBlur,
    onFocus,
    ariaLabel,
    ariaDescribedBy,
    tabIndex,
    columns
  } = props;

  // Get form context
  const formContext = useFormContext();
  
  // Use field hook for field-specific logic
  const { 
    value: fieldValue, 
    error: fieldError, 
    touched, 
    isValidating,
    handleChange, 
    handleBlur: fieldHandleBlur
  } = useField({
    name,
    defaultValue: defaultValue ?? getDefaultFieldValue('textarea'),
    transform,
    parse,
    onChange,
    onBlur,
    updateOn,
    validators,
    asyncValidators,
    deps,
    formValues: formContext.values,
    formErrors: formContext.errors,
    formTouched: formContext.touched,
    formIsValidating: formContext.isValidating,
    setValue: formContext.setValue,
    setTouched: formContext.setTouched,
    validateField: formContext.validateField,
    registerFieldValidation: formContext.registerFieldValidation,
    unregisterFieldValidation: formContext.unregisterFieldValidation
  });

  // Use controlled value if provided, otherwise use field value
  const currentValue = controlledValue !== undefined ? controlledValue : fieldValue;
  
  // Use prop error if provided, otherwise use field error
  const currentError = error || (touched ? fieldError : undefined);
  
  // Generate unique field ID
  const fieldId = generateFieldId(name);
  
  // Handle rich text changes
  const handleRichTextChange = React.useCallback((html: string) => {
    // Convert TipTap onChange to React ChangeEvent for form integration
    const syntheticEvent = {
      target: { 
        name,
        value: html,
        type: 'textarea'
      },
      currentTarget: { value: html },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    handleChange(syntheticEvent);
  }, [name, handleChange]);

  // Handle blur events
  const handleBlurEvent = React.useCallback((event?: FocusEvent) => {
    fieldHandleBlur();
    onBlur?.();
  }, [fieldHandleBlur, onBlur]);

  // Render label if provided
  const renderLabel = () => {
    if (!label) return null;

    return (
      <label className="form-label" htmlFor={fieldId}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
    );
  };

  // Render help text and validation status
  const renderHelpText = () => {
    if (!helpText && !currentError && !isValidating) return null;

    // Show validation spinner if validating
    if (isValidating) {
      return (
        <div className="form-text">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Validating...
        </div>
      );
    }

    return (
      <div className={classNames(
        currentError ? 'invalid-feedback' : 'form-text',
        currentError && 'd-block' // Show error even without is-invalid on input
      )}>
        {currentError || helpText}
      </div>
    );
  };

  // Handle columns for FieldGroup support
  const wrapperClasses = classNames(
    "mb-3",
    (columns && columns > 0) ? `col-${columns}` : null
  );

  return (
    <div className={wrapperClasses}>
      {renderLabel()}
      
      <Tiptap
        id={fieldId}
        name={name}
        value={currentValue || ''}
        onChange={handleRichTextChange}
        onBlur={handleBlurEvent}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        minHeight={minHeight}
        variant={variant}
        showToolbar={showToolbar}
        className={classNames(
          className,
          currentError && 'border-danger shadow'
        )}
        extensions={extensions}
        autoFocus={autoFocus}
      />
      
      {renderHelpText()}
    </div>
  );
};

export default RichTextField;
