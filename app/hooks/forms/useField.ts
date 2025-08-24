import { useCallback, useEffect } from 'react';
import { FieldProps } from '../../widgets/modern-forms/types/field';
import { ValidationRule, AsyncValidationRule } from '../../widgets/modern-forms/types/validation';

export interface UseFieldOptions extends Pick<
  FieldProps, 
  'name' | 'defaultValue' | 'transform' | 'parse' | 'onChange' | 'onBlur' | 'updateOn' | 'validators' | 'asyncValidators' | 'deps'
> {
  formValues?: Record<string, any>;
  formErrors?: Record<string, string | undefined>;
  formTouched?: Record<string, boolean>;
  formIsValidating?: Record<string, boolean>;
  setValue?: (name: string, value: any) => void;
  setTouched?: (name: string, touched?: boolean) => void;
  validateField?: (name: string, triggerType?: 'change' | 'blur' | 'submit') => Promise<boolean>;
  registerFieldValidation?: (name: string, config: any) => void;
  unregisterFieldValidation?: (name: string) => void;
}

export const useField = (options: UseFieldOptions) => {
  const {
    name,
    defaultValue = '',
    transform,
    parse,
    onChange,
    onBlur,
    updateOn = 'blur',
    validators = [],
    asyncValidators = [],
    deps = [],
    formValues = {},
    formErrors = {},
    formTouched = {},
    formIsValidating = {},
    setValue,
    setTouched,
    validateField,
    registerFieldValidation,
    unregisterFieldValidation
  } = options;

  // Register field validation config with form on mount
  useEffect(() => {
    if (registerFieldValidation && (validators.length > 0 || asyncValidators.length > 0)) {
      registerFieldValidation(name, {
        rules: validators,
        asyncRules: asyncValidators,
        deps,
        updateOn
      });
    }

    // Cleanup on unmount
    return () => {
      if (unregisterFieldValidation) {
        unregisterFieldValidation(name);
      }
    };
  }, [
    name, 
    validators, 
    asyncValidators, 
    deps, 
    updateOn, 
    registerFieldValidation, 
    unregisterFieldValidation
  ]);

  // Get current field value
  const value = formValues[name] ?? defaultValue;
  const error = formErrors[name];
  const touched = formTouched[name] ?? false;
  const isValidating = formIsValidating[name] ?? false;

  // Handle field change
  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = event.target.value;
    
    // Apply parse function if provided
    if (parse) {
      newValue = parse(newValue);
    }
    
    // Apply transform function if provided  
    if (transform) {
      newValue = transform(newValue);
    }

    // Update form state
    if (setValue) {
      setValue(name, newValue);
    }

    // Validate on change if configured
    if (validateField && updateOn === 'change') {
      await validateField(name, 'change');
    }

    // Call external onChange if provided
    if (onChange) {
      onChange(newValue);
    }
  }, [name, parse, transform, setValue, validateField, updateOn, onChange]);

  // Handle field blur
  const handleBlur = useCallback(async () => {
    // Mark field as touched
    if (setTouched) {
      setTouched(name, true);
    }
    
    // Validate on blur if configured
    if (validateField && updateOn === 'blur') {
      await validateField(name, 'blur');
    }

    // Call external onBlur if provided
    if (onBlur) {
      onBlur();
    }
  }, [name, setTouched, validateField, updateOn, onBlur]);

  // Manual validate function
  const validate = useCallback(async (): Promise<boolean> => {
    if (validateField) {
      return await validateField(name, 'submit');
    }
    return true;
  }, [name, validateField]);

  return {
    value,
    error,
    touched,
    isValidating,
    handleChange,
    handleBlur,
    validate,
    hasValidation: validators.length > 0 || asyncValidators.length > 0
  };
};
