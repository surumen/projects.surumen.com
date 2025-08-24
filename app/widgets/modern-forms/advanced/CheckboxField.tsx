import React from 'react';
import { CheckboxFieldProps } from '../types/advanced';
import { useFormContext } from '../core/Form';
import { useField } from '../../../hooks/forms/useField';
import { generateFieldId } from '../utils/fieldHelpers';
import { classNames } from '../utils/classNames';

/**
 * CheckboxField component - Checkbox using Bootstrap form-check
 * 
 * Generates HTML structure:
 * 
 * Standard layout:
 * <div class="form-check mb-3">
 *   <input type="checkbox" id="field_name" class="form-check-input">
 *   <label class="form-check-label" for="field_name">Label</label>
 *   <div class="text-muted">Help text</div>
 * </div>
 * 
 * Inline layout:
 * <div class="form-check form-check-inline">
 *   <input type="checkbox" id="field_name" class="form-check-input">
 *   <label class="form-check-label" for="field_name">Label</label>
 * </div>
 */
export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  defaultValue = false,
  value: controlledValue,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  className,
  inline = false,
  indeterminate = false,
  validators = [],
  asyncValidators = [],
  deps = [],
  updateOn = 'change',
  transform,
  onChange,
  onBlur,
  onFocus,
  ariaLabel,
  ariaDescribedBy,
  ...rest
}) => {
  // Get form context
  const formContext = useFormContext();
  
  // Use field hook for field-specific logic (validation registration only)
  useField({
    name,
    defaultValue,
    validators,
    asyncValidators,
    deps,
    updateOn,
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

  // Get current field state directly from form context
  const currentValue = controlledValue !== undefined ? controlledValue : formContext.values[name] ?? defaultValue;
  const currentError = error || (formContext.touched[name] ? formContext.errors[name] : undefined);
  const isValidating = formContext.isValidating[name] ?? false;
  
  // Generate unique field ID
  const fieldId = generateFieldId(name);
  
  // Help text ID for aria-describedby
  const helpTextId = helpText ? `${fieldId}_help` : undefined;
  const errorId = currentError ? `${fieldId}_error` : undefined;
  const describedBy = [helpTextId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  // Handle checkbox change
  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    
    // Apply transform function if provided  
    const transformedValue = transform ? transform(newValue) : newValue;

    // Update form state directly
    formContext.setValue(name, transformedValue);

    // Validate on change if configured
    if (updateOn === 'change') {
      await formContext.validateField(name, 'change');
    }

    // Call external onChange if provided
    if (onChange) {
      onChange(transformedValue);
    }
  };

  // Build checkbox classes
  const checkboxClasses = classNames(
    'form-check-input',
    indeterminate && 'indeterminate-checkbox',
    className
  );

  // Build wrapper classes
  const wrapperClasses = classNames(
    'form-check',
    inline ? 'form-check-inline' : 'mb-3'
  );

  return (
    <div className={wrapperClasses}>
      <input
        type="checkbox"
        id={fieldId}
        name={name}
        className={checkboxClasses}
        checked={!!currentValue}
        disabled={disabled || readOnly}
        required={required}
        aria-invalid={!!currentError}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onChange={handleCheckboxChange}
        onBlur={async () => {
          // Mark field as touched
          formContext.setTouched(name, true);
          
          // Validate on blur if configured
          if (updateOn === 'blur') {
            await formContext.validateField(name, 'blur');
          }

          // Call external onBlur if provided
          if (onBlur) {
            onBlur();
          }
        }}
        onFocus={onFocus}
        {...rest}
      />
      
      <label className="form-check-label" htmlFor={fieldId}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      
      {!inline && helpText && (
        <div id={helpTextId} className="text-muted">
          {helpText}
        </div>
      )}
      
      {!inline && currentError && (
        <div id={errorId} className="invalid-feedback d-block">
          {currentError}
        </div>
      )}
    </div>
  );
};

export default CheckboxField;
