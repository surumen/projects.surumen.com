import { useCallback, useRef, useState } from 'react';
import { ValidationRule, AsyncValidationRule } from '../../widgets/modern-forms/types/validation';
import { validateValue, validateValueAsync } from '../../widgets/modern-forms/utils/validation';
import { debounceAsync } from '../../widgets/modern-forms/utils/debounce';

export interface UseValidationOptions {
  rules?: ValidationRule[];
  asyncRules?: AsyncValidationRule[];
  deps?: string[];
  updateOn?: 'change' | 'blur' | 'submit';
}

export interface ValidationState {
  error?: string;
  isValidating: boolean;
  isValid: boolean;
}

export const useValidation = (
  fieldName: string,
  options: UseValidationOptions = {}
) => {
  const {
    rules = [],
    asyncRules = [],
    deps = [],
    updateOn = 'blur'
  } = options;

  const [state, setState] = useState<ValidationState>({
    isValidating: false,
    isValid: true
  });

  // Keep track of the latest validation call to avoid race conditions
  const validationId = useRef(0);

  // Create debounced async validator for each async rule
  const debouncedValidators = useRef(
    asyncRules.map(rule => 
      debounceAsync(
        async (value: any, formValues?: Record<string, any>) => {
          const error = await validateValueAsync(value, [rule], formValues);
          return { error, rule };
        },
        rule.debounceMs || 300
      )
    )
  );

  // Validate sync rules
  const validateSync = useCallback(async (
    value: any,
    formValues?: Record<string, any>
  ): Promise<string | undefined> => {
    if (rules.length === 0) return undefined;
    return validateValue(value, rules, formValues);
  }, [rules]);

  // Validate async rules
  const validateAsync = useCallback(async (
    value: any,
    formValues?: Record<string, any>
  ): Promise<string | undefined> => {
    if (asyncRules.length === 0) return undefined;

    const currentValidationId = ++validationId.current;
    
    setState(prev => ({ ...prev, isValidating: true }));

    try {
      // Run all async validations in parallel
      const asyncResults = await Promise.all(
        debouncedValidators.current.map(validator => 
          validator(value, formValues)
        )
      );

      // Check if this validation is still the latest one
      if (validationId.current !== currentValidationId) {
        return undefined; // Ignore outdated validation
      }

      // Find first error
      const errorResult = asyncResults.find(result => result.error);
      return errorResult?.error;
    } catch (error) {
      console.error('Async validation error:', error);
      return 'Validation error occurred';
    }
  }, [asyncRules]);

  // Main validation function
  const validate = useCallback(async (
    value: any,
    formValues?: Record<string, any>,
    triggerType: 'change' | 'blur' | 'submit' = 'blur'
  ): Promise<ValidationState> => {
    // Check if we should validate based on updateOn setting
    if (triggerType !== 'submit' && updateOn !== triggerType) {
      return state;
    }

    try {
      // First run sync validation
      const syncError = await validateSync(value, formValues);
      
      if (syncError) {
        const newState = {
          error: syncError,
          isValidating: false,
          isValid: false
        };
        setState(newState);
        return newState;
      }

      // If sync validation passes, run async validation
      const asyncError = await validateAsync(value, formValues);
      
      const newState = {
        error: asyncError,
        isValidating: false,
        isValid: !asyncError
      };
      
      setState(newState);
      return newState;
    } catch (error) {
      const newState = {
        error: 'Validation error occurred',
        isValidating: false,
        isValid: false
      };
      setState(newState);
      return newState;
    }
  }, [validateSync, validateAsync, updateOn, state]);

  // Clear validation state
  const clearValidation = useCallback(() => {
    setState({
      isValidating: false,
      isValid: true,
      error: undefined
    });
  }, []);

  // Check if field should revalidate based on dependencies
  const shouldRevalidate = useCallback((
    changedField: string,
    currentValue: any,
    formValues?: Record<string, any>
  ): boolean => {
    return deps.includes(changedField) && state.error !== undefined;
  }, [deps, state.error]);

  return {
    ...state,
    validate,
    clearValidation,
    shouldRevalidate,
    hasRules: rules.length > 0 || asyncRules.length > 0
  };
};
