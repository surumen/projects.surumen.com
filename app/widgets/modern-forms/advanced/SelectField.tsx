import React from 'react';
import { SelectFieldProps } from '../types/advanced';
import { useFormContext } from '../core/Form';
import { useField } from '../../../hooks/forms/useField';
import { generateFieldId } from '../utils/fieldHelpers';
import { classNames } from '../utils/classNames';

/**
 * SelectField component - Native browser select for single selection
 * 
 * Clean, simple implementation using native <select> element:
 * - Single selection only (multi-select handled by TagsField)
 * - No external dependencies
 * - Full form integration with validation
 * - Dynamic options from props
 * - Bootstrap styling support
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options = [],
  defaultValue,
  value: controlledValue,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  placeholder = 'Select an option...',
  helpText,
  className,
  multiple = false, // Always false - use TagsField for multiple selection
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
  const formContext = useFormContext();
  const fieldId = generateFieldId(name);
  
  // Form integration - single select only
  useField({
    name,
    defaultValue: defaultValue ?? '',
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

  // Current field state - single value only
  const currentValue = controlledValue !== undefined ? controlledValue : formContext.values[name] ?? (defaultValue ?? '');
  const currentError = error || (formContext.touched[name] ? formContext.errors[name] : undefined);
  const isValidating = formContext.isValidating[name] ?? false;
  
  // Accessibility attributes
  const helpTextId = helpText ? `${fieldId}_help` : undefined;
  const errorId = currentError ? `${fieldId}_error` : undefined;
  const describedBy = [helpTextId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  // Handle change events - single select only
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;

    // Apply transform if provided
    const transformedValue = transform ? transform(newValue) : newValue;

    // Update form state
    formContext.setValue(name, transformedValue);

    // Trigger validation if needed
    if (updateOn === 'change') {
      await formContext.validateField(name, 'change');
    }

    // Call external handler
    onChange?.(transformedValue);
  };

  // Handle blur events
  const handleBlur = async () => {
    formContext.setTouched(name, true);
    
    if (updateOn === 'blur') {
      await formContext.validateField(name, 'blur');
    }
    
    onBlur?.();
  };

  // Generate select classes
  const selectClasses = classNames(
    'form-select',
    currentError && 'is-invalid',
    className
  );

  // Render label
  const renderLabel = () => {
    if (!label) return null;
    return (
      <label className="form-label" htmlFor={fieldId}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
    );
  };

  // Render validation state
  const renderValidationState = () => {
    if (isValidating) {
      return (
        <div className="form-text">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Validating...
        </div>
      );
    }

    if (currentError || helpText) {
      return (
        <div
          id={currentError ? errorId : helpTextId}
          className={classNames(
            currentError ? 'invalid-feedback d-block' : 'form-text'
          )}
        >
          {currentError || helpText}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-3">
      {renderLabel()}
      
      <select
        id={fieldId}
        name={name}
        className={selectClasses}
        value={currentValue}
        disabled={disabled || readOnly}
        required={required}
        aria-invalid={!!currentError}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        autoComplete="off"
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={onFocus}
        {...rest}
      >
        {/* Placeholder option */}
        <option value="" disabled={required}>
          {placeholder}
        </option>
        
        {/* Render options */}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {renderValidationState()}
    </div>
  );
};

export default SelectField;
