import React, { useContext, createContext } from 'react';
import { FieldProps } from '../types/field';
import { useFormContext } from './Form';
import { useField } from '../../../hooks/forms/useField';
import {
  generateFieldId,
  shouldUseTextarea,
  getHtmlInputType,
  getDefaultFieldValue
} from '../utils/fieldHelpers';
import { classNames, getFormControlClasses } from '../utils/classNames';
import { DEFAULT_FIELD_TYPE } from '../constants/fieldTypes';

// InputGroup context to detect if Field is inside InputGroup
const InputGroupContext = createContext<boolean>(false);
export const useInputGroupContext = () => useContext(InputGroupContext);
export const InputGroupProvider = InputGroupContext.Provider;

/**
 * Field component - Primary form input component
 * 
 * Generates HTML structure matching Bootstrap patterns:
 * 
 * When standalone:
 * <div class="mb-3">
 *   <label class="form-label" for="field_name">Label</label>
 *   <input type="text" id="field_name" class="form-control" />
 *   <span class="form-text">Help text</span>
 * </div>
 * 
 * When inside InputGroup:
 * <input type="text" id="field_name" class="form-control" />
 * (wrapper and label handled by InputGroup)
 */
export const Field: React.FC<FieldProps> = (props) => {
  const {
    name,
    label,
    type = DEFAULT_FIELD_TYPE,
    defaultValue,
    value: controlledValue,
    required = false,
    disabled = false,
    readOnly = false,
    error,
    placeholder,
    helpText,
    autoFocus = false,
    className,
    rows = 4, // Default for textarea
    maxLength,
    minLength,
    pattern,
    min,
    max,
    step,
    autoComplete,
    tabIndex,
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
    ariaDescribedBy
  } = props;
  // Get form context
  const formContext = useFormContext();
  
  // Check if we're inside an InputGroup
  const isInInputGroup = useInputGroupContext();
  
  // Use field hook for field-specific logic
  const { 
    value: fieldValue, 
    error: fieldError, 
    touched, 
    isValidating,
    handleChange, 
    handleBlur,
    hasValidation
  } = useField({
    name,
    defaultValue: defaultValue ?? getDefaultFieldValue(type),
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
  
  // Generate classes
  const inputClasses = getFormControlClasses(
    shouldUseTextarea(type) ? 'textarea' : 'input',
    className,
    !!currentError
  );

  // Build common input props
  const commonProps = {
    id: fieldId,
    name,
    value: currentValue || '',
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus,
    disabled,
    readOnly,
    required,
    autoFocus,
    placeholder,
    className: inputClasses,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    autoComplete,
    tabIndex,
    maxLength,
    minLength,
    pattern,
    min,
    max,
    step
  };

  // Render input or textarea based on type
  const renderInput = () => {
    if (shouldUseTextarea(type)) {
      return (
        <textarea
          {...commonProps}
          rows={rows}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={getHtmlInputType(type)}
      />
    );
  };

  // If inside InputGroup, return just the input without wrapper
  if (isInInputGroup) {
    return renderInput();
  }

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

  return (
    <div className="mb-3">
      {renderLabel()}
      {renderInput()}
      {renderHelpText()}
    </div>
  );
};

export default Field;
