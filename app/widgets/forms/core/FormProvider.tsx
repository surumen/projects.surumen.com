import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { FormState, FormActions, FormConfig, ValidationRule, AsyncValidationRule } from '@/types/forms/advanced';
import { useFormDrafts } from '@/store/forms/formStore';

// ========================
// FORM REDUCER
// ========================

type FormAction =
  | { type: 'SET_VALUE'; name: string; value: any }
  | { type: 'SET_VALUES'; values: Record<string, any> }
  | { type: 'SET_ERROR'; name: string; error: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'CLEAR_ERROR'; name: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_TOUCHED'; name: string; touched: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ASYNC_VALIDATING'; name: string; validating: boolean }
  | { type: 'INCREMENT_SUBMIT_COUNT' }
  | { type: 'RESET'; values?: Record<string, any> };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        isDirty: true
      };

    case 'SET_VALUES':
      return {
        ...state,
        values: { ...state.values, ...action.values },
        isDirty: true
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.name]: action.error },
        isValid: false
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: { ...state.errors, ...action.errors },
        isValid: Object.keys(action.errors).length === 0
      };

    case 'CLEAR_ERROR':
      const { [action.name]: removedError, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors,
        isValid: Object.keys(remainingErrors).length === 0
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
        isValid: true
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.name]: action.touched }
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };

    case 'SET_ASYNC_VALIDATING':
      return {
        ...state,
        asyncValidating: { ...state.asyncValidating, [action.name]: action.validating }
      };

    case 'INCREMENT_SUBMIT_COUNT':
      return {
        ...state,
        submitCount: state.submitCount + 1
      };

    case 'RESET':
      return {
        values: action.values || {},
        errors: {},
        touched: {},
        isSubmitting: false,
        isDirty: false,
        isValid: true,
        asyncValidating: {},
        submitCount: 0
      };

    default:
      return state;
  }
};

// ========================
// FORM CONTEXT
// ========================

interface FormContextType extends FormState, FormActions {
  config: FormConfig;
}

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// ========================
// VALIDATION UTILITIES
// ========================

const validateSyncRules = (
  value: any,
  rules: ValidationRule[],
  formValues: Record<string, any>
): string => {
  for (const rule of rules) {
    if (!rule.test(value, formValues)) {
      return typeof rule.message === 'function'
        ? rule.message(value, formValues)
        : rule.message;
    }
  }
  return '';
};

const validateAsyncRules = async (
  value: any,
  rules: AsyncValidationRule[],
  formValues: Record<string, any>
): Promise<string> => {
  for (const rule of rules) {
    try {
      const isValid = await rule.test(value, formValues);
      if (!isValid) {
        return typeof rule.message === 'function'
          ? rule.message(value, formValues)
          : rule.message;
      }
    } catch (error) {
      console.warn('Async validation error:', error);
      return 'Validation failed';
    }
  }
  return '';
};

// ========================
// DEBOUNCED VALIDATION HOOK
// ========================

const useDebouncedValidation = (callback: () => void, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
};

// ========================
// FORM PROVIDER
// ========================

interface FormProviderProps {
  config: FormConfig;
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ config, children }) => {
  const { saveDraft, loadDraft } = useFormDrafts();

  // Initialize form state
  const initialState: FormState = useMemo(() => {
    const initialValues = { ...config.initialValues } || {};
    
    // Extract initial values from field configurations
    config.fields.forEach(field => {
      if (field.initialValue !== undefined && !(field.name in initialValues)) {
        initialValues[field.name] = field.initialValue;
      }
    });
    
    // Load from draft if persistence is enabled
    if (config.persistence?.key) {
      const draft = loadDraft(config.persistence.key);
      if (draft) {
        Object.assign(initialValues, draft.values);
      }
    }

    return {
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
      isValid: true,
      asyncValidating: {},
      submitCount: 0
    };
  }, [config.initialValues, config.fields, config.persistence?.key, loadDraft]);

  const [state, dispatch] = useReducer(formReducer, initialState);

  // Auto-save functionality
  const debouncedAutoSave = useDebouncedValidation(
    useCallback(() => {
      if (config.persistence?.autoSave && config.persistence.key && state.isDirty) {
        saveDraft(config.persistence.key, state.values);
      }
    }, [config.persistence, state.values, state.isDirty, saveDraft]),
    config.persistence?.autoSaveInterval || 30000
  );

  useEffect(() => {
    if (config.persistence?.autoSave) {
      debouncedAutoSave();
    }
  }, [state.values, debouncedAutoSave, config.persistence?.autoSave]);

  // Form actions
  const setError = useCallback((name: string, error: string) => {
    dispatch({ type: 'SET_ERROR', name, error });
  }, []);

  const clearError = useCallback((name: string) => {
    dispatch({ type: 'CLEAR_ERROR', name });
  }, []);

  const validateField = useCallback(async (name: string): Promise<boolean> => {
    const field = config.fields.find(f => f.name === name);
    if (!field) return true;

    const value = state.values[name];
    let error = '';

    // Sync validation
    if (field.validate) {
      error = validateSyncRules(value, field.validate, state.values);
    }

    if (error) {
      setError(name, error);
      return false;
    }

    // Async validation
    if (field.asyncValidate && field.asyncValidate.length > 0) {
      dispatch({ type: 'SET_ASYNC_VALIDATING', name, validating: true });
      
      try {
        error = await validateAsyncRules(value, field.asyncValidate, state.values);
        if (error) {
          setError(name, error);
          return false;
        } else {
          clearError(name);
        }
      } finally {
        dispatch({ type: 'SET_ASYNC_VALIDATING', name, validating: false });
      }
    } else {
      clearError(name);
    }

    return true;
  }, [config.fields, state.values, setError, clearError]);

  const setValue = useCallback((name: string, value: any) => {
    dispatch({ type: 'SET_VALUE', name, value });
    
    // Trigger validation based on mode
    if (config.validation?.mode === 'onChange' || config.validation?.mode === 'all') {
      validateField(name);
    }
  }, [config.validation?.mode, validateField]);

  const setValues = useCallback((values: Record<string, any>) => {
    dispatch({ type: 'SET_VALUES', values });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', errors });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const setTouched = useCallback((name: string, touched: boolean = true) => {
    dispatch({ type: 'SET_TOUCHED', name, touched });
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting });
  }, []);

  const reset = useCallback((values?: Record<string, any>) => {
    dispatch({ type: 'RESET', values });
  }, []);

  const validateForm = useCallback(async (): Promise<boolean> => {
    const validationPromises = config.fields.map(field => validateField(field.name));
    const results = await Promise.all(validationPromises);
    return results.every(result => result);
  }, [config.fields, validateField]);

  const submit = useCallback(async () => {
    dispatch({ type: 'INCREMENT_SUBMIT_COUNT' });
    setSubmitting(true);

    try {
      // Mark all fields as touched
      config.fields.forEach(field => {
        setTouched(field.name, true);
      });

      // Validate form
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }

      // Submit
      await config.onSubmit(state.values);

      // Handle post-submission behavior
      if (config.behavior?.resetOnSuccess) {
        reset(config.initialValues);
      } else if (config.behavior?.clearOnSuccess) {
        reset({});
      }

    } catch (error) {
      console.error('Form submission error:', error);
      // You might want to set a general form error here
    } finally {
      setSubmitting(false);
    }
  }, [
    config,
    state.values,
    setTouched,
    validateForm,
    setSubmitting,
    reset
  ]);

  const contextValue: FormContextType = {
    ...state,
    config,
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    setTouched,
    setSubmitting,
    reset,
    submit,
    validateField,
    validateForm
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// ========================
// CONVENIENCE HOOKS
// ========================

export const useField = (name: string) => {
  const context = useFormContext();
  const {
    values,
    errors,
    touched,
    asyncValidating,
    setValue,
    setTouched,
    validateField,
    config
  } = context;

  const value = values[name];
  const error = errors[name];
  const isTouched = touched[name];
  const isValidating = asyncValidating[name];

  const onChange = useCallback((newValue: any) => {
    setValue(name, newValue);
  }, [name, setValue]);

  const onBlur = useCallback(() => {
    setTouched(name);
    
    // Validate on blur if configured
    if (config.validation?.mode === 'onBlur' || config.validation?.mode === 'all') {
      validateField(name);
    }
  }, [name, setTouched, validateField, config.validation?.mode]);

  return {
    value,
    error,
    isTouched,
    isValidating,
    onChange,
    onBlur
  };
};

export const useFormStatus = () => {
  const { isSubmitting, isDirty, isValid, submitCount } = useFormContext();
  
  return {
    isSubmitting,
    isDirty,
    isValid,
    submitCount,
    canSubmit: !isSubmitting && isValid
  };
};
