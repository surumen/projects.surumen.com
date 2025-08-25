import { useState, useCallback, useMemo, useRef } from 'react';
import { FormState } from '../../widgets/modern-forms/types/form';
import { ValidationRule, AsyncValidationRule } from '../../widgets/modern-forms/types/validation';
import { validateValue, validateValueAsync } from '../../widgets/modern-forms/utils/validation';

export interface UseFormOptions {
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  validate?: (values: Record<string, any>) => Record<string, string> | Promise<Record<string, string>>;
}

export interface FieldValidationConfig {
  rules?: ValidationRule[];
  asyncRules?: AsyncValidationRule[];
  deps?: string[];
  updateOn?: 'change' | 'blur' | 'submit';
}

export const useForm = (options: UseFormOptions = {}) => {
  const { initialValues = {}, onSubmit, validate: formValidate } = options;

  // Form state
  const [state, setState] = useState<FormState>({
    values: { ...initialValues },
    initialValues: { ...initialValues },
    errors: {},
    touched: {},
    isValidating: {},
    isSubmitting: false,
  });

  // Field validation configurations
  const fieldValidations = useRef<Record<string, FieldValidationConfig>>({});
  
  // Validation ID to prevent race conditions
  const validationId = useRef(0);
  
  // Ref to store current validateField function
  const validateFieldRef = useRef<((name: string, triggerType?: 'change' | 'blur' | 'submit') => Promise<boolean>) | null>(null);

  // Register field validation
  const registerFieldValidation = useCallback((
    fieldName: string,
    config: FieldValidationConfig
  ) => {
    fieldValidations.current[fieldName] = config;
  }, []);

  // Unregister field validation
  const unregisterFieldValidation = useCallback((fieldName: string) => {
    delete fieldValidations.current[fieldName];
  }, []);

  // Set field value
  const setValue = useCallback((name: string, value: any) => {
    setState(prev => {
      const newValues = { ...prev.values, [name]: value };
      
      // Clear error when value changes
      const newErrors = { ...prev.errors };
      if (newErrors[name]) {
        delete newErrors[name];
      }

      return {
        ...prev,
        values: newValues,
        errors: newErrors
      };
    });

    // Check if any fields depend on this field and revalidate them
    // Use setTimeout to avoid stale closure
    setTimeout(() => {
      Object.keys(fieldValidations.current).forEach(fieldName => {
        const config = fieldValidations.current[fieldName];
        if (config.deps?.includes(name)) {
          setState(currentState => {
            if (currentState.touched[fieldName]) {
              // Schedule revalidation for dependent field
              setTimeout(() => {
                // Access validateField from the current scope when setTimeout executes
                const currentValidateField = validateFieldRef.current;
                if (currentValidateField) {
                  currentValidateField(fieldName);
                }
              }, 0);
            }
            return currentState;
          });
        }
      });
    }, 0);
  }, []);

  // Set field error
  const setError = useCallback((name: string, error?: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error
      }
    }));
  }, []);

  // Set field touched state
  const setTouched = useCallback((name: string, touched: boolean = true) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: touched
      }
    }));
  }, []);

  // Set field validating state
  const setValidating = useCallback((name: string, validating: boolean) => {
    setState(prev => ({
      ...prev,
      isValidating: {
        ...prev.isValidating,
        [name]: validating
      }
    }));
  }, []);

  // Validate single field
  const validateField = useCallback(async (
    name: string,
    triggerType: 'change' | 'blur' | 'submit' = 'blur'
  ): Promise<boolean> => {
    const config = fieldValidations.current[name];
    if (!config) return true;

    const { rules = [], asyncRules = [], updateOn = 'blur' } = config;
    
    // Check if we should validate based on updateOn setting
    if (triggerType !== 'submit' && updateOn !== triggerType) {
      return true;
    }

    const currentValue = state.values[name];
    const currentValidationId = ++validationId.current;
    
    try {
      // Set validating state for async rules
      if (asyncRules.length > 0) {
        setValidating(name, true);
      }

      // Sync validation first
      let error: string | undefined;
      if (rules.length > 0) {
        error = await validateValue(currentValue, rules, state.values);
      }

      // If sync validation passes and we have async rules, validate async
      if (!error && asyncRules.length > 0) {
        error = await validateValueAsync(currentValue, asyncRules, state.values);
      }

      // Check if this validation is still current
      if (validationId.current !== currentValidationId) {
        return true; // Ignore outdated validation
      }

      // Update error state
      setError(name, error);
      setValidating(name, false);

      return !error;
    } catch (err) {
      console.error(`Field validation error for ${name}:`, err);
      setError(name, 'Validation error occurred');
      setValidating(name, false);
      return false;
    }
  }, [state.values, setError, setValidating]);

  // Store validateField in ref for dependent field validation
  validateFieldRef.current = validateField;

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    const fieldNames = Object.keys(fieldValidations.current);
    
    // Validate all fields
    const validationResults = await Promise.all(
      fieldNames.map(name => validateField(name, 'submit'))
    );

    // Run form-level validation if provided
    if (formValidate) {
      try {
        const formErrors = await formValidate(state.values);
        Object.entries(formErrors).forEach(([name, error]) => {
          if (error) setError(name, error);
        });
        
        // Check if any form-level errors were added
        const hasFormErrors = Object.values(formErrors).some(error => !!error);
        if (hasFormErrors) {
          return false;
        }
      } catch (error) {
        console.error('Form validation error:', error);
        return false;
      }
    }

    return validationResults.every(isValid => isValid);
  }, [state.values, validateField, formValidate, setError]);

  // Submit form
  const submit = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const isValid = await validateForm();
      if (isValid && onSubmit) {
        await onSubmit(state.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [validateForm, onSubmit, state.values]);

  // Reset form
  const reset = useCallback((newValues?: Record<string, any>) => {
    const resetValues = newValues || initialValues;
    setState({
      values: { ...resetValues },
      initialValues: { ...resetValues },
      errors: {},
      touched: {},
      isValidating: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  // Computed properties
  const isDirty = useMemo(() => {
    return JSON.stringify(state.values) !== JSON.stringify(state.initialValues);
  }, [state.values, state.initialValues]);

  const isValid = useMemo(() => {
    return Object.values(state.errors).every(error => !error);
  }, [state.errors]);

  const isFormValidating = useMemo(() => {
    return Object.values(state.isValidating).some(validating => validating);
  }, [state.isValidating]);

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValidating: state.isValidating,
    isSubmitting: state.isSubmitting,
    isDirty,
    isValid,
    isFormValidating,

    // Actions
    setValue,
    setError,
    setTouched,
    setValidating,
    validateField,
    validateForm,
    submit,
    reset,

    // Field validation registration
    registerFieldValidation,
    unregisterFieldValidation,
  };
};
