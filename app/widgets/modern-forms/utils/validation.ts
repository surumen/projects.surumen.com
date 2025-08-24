import { ValidationRule, AsyncValidationRule } from '../types/validation';

/**
 * Create a synchronous validation rule
 */
export const createValidationRule = (
  test: (value: any, formValues?: Record<string, any>) => boolean,
  message: string | ((value: any, formValues?: Record<string, any>) => string)
): ValidationRule => ({
  test,
  message
});

/**
 * Create an asynchronous validation rule
 */
export const createAsyncValidationRule = (
  test: (value: any, formValues?: Record<string, any>) => Promise<boolean>,
  message: string | ((value: any, formValues?: Record<string, any>) => string),
  debounceMs: number = 300
): AsyncValidationRule => ({
  test,
  message,
  debounceMs
});

/**
 * Built-in validation rules
 */
export const validationRules = {
  required: (fieldName: string = 'This field'): ValidationRule =>
    createValidationRule(
      (value) => value !== undefined && value !== null && value !== '' && 
                  (Array.isArray(value) ? value.length > 0 : true),
      `${fieldName} is required`
    ),

  email: (): ValidationRule =>
    createValidationRule(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Please enter a valid email address'
    ),

  url: (): ValidationRule =>
    createValidationRule(
      (value) => !value || /^https?:\/\/.+\..+/.test(value),
      'Please enter a valid URL (e.g. https://example.com)'
    ),

  minLength: (min: number, fieldName: string = 'This field'): ValidationRule =>
    createValidationRule(
      (value) => !value || String(value).length >= min,
      `${fieldName} must be at least ${min} characters long`
    ),

  maxLength: (max: number, fieldName: string = 'This field'): ValidationRule =>
    createValidationRule(
      (value) => !value || String(value).length <= max,
      `${fieldName} must be no more than ${max} characters long`
    ),

  pattern: (regex: RegExp, message: string): ValidationRule =>
    createValidationRule(
      (value) => !value || regex.test(value),
      message
    ),

  numeric: (): ValidationRule =>
    createValidationRule(
      (value) => !value || /^\d+(\.\d+)?$/.test(value),
      'Must be a valid number'
    ),

  integer: (): ValidationRule =>
    createValidationRule(
      (value) => !value || /^\d+$/.test(value),
      'Must be a valid integer'
    ),

  min: (minimum: number): ValidationRule =>
    createValidationRule(
      (value) => !value || Number(value) >= minimum,
      `Value must be at least ${minimum}`
    ),

  max: (maximum: number): ValidationRule =>
    createValidationRule(
      (value) => !value || Number(value) <= maximum,
      `Value must be no more than ${maximum}`
    ),

  phone: (): ValidationRule =>
    createValidationRule(
      (value) => !value || /^\+?[\d\s\-\(\)]+$/.test(value),
      'Please enter a valid phone number'
    ),

  custom: (
    validator: (value: any, formValues?: Record<string, any>) => boolean,
    message: string
  ): ValidationRule =>
    createValidationRule(validator, message),

  // Field dependency validation
  matches: (fieldName: string, label: string = 'field'): ValidationRule =>
    createValidationRule(
      (value, formValues) => !value || value === formValues?.[fieldName],
      `Must match ${label}`
    ),

  // Conditional validation
  requiredIf: (
    condition: (formValues: Record<string, any>) => boolean,
    fieldName: string = 'This field'
  ): ValidationRule =>
    createValidationRule(
      (value, formValues) => {
        if (!formValues || !condition(formValues)) return true;
        return value !== undefined && value !== null && value !== '';
      },
      `${fieldName} is required`
    )
};

/**
 * Common async validation rules
 */
export const asyncValidationRules = {
  uniqueEmail: (checkEmailFn: (email: string) => Promise<boolean>): AsyncValidationRule =>
    createAsyncValidationRule(
      async (value) => {
        if (!value) return true;
        return await checkEmailFn(value);
      },
      'This email is already taken'
    ),

  uniqueUsername: (checkUsernameFn: (username: string) => Promise<boolean>): AsyncValidationRule =>
    createAsyncValidationRule(
      async (value) => {
        if (!value) return true;
        return await checkUsernameFn(value);
      },
      'This username is already taken'
    ),

  customAsync: (
    validator: (value: any, formValues?: Record<string, any>) => Promise<boolean>,
    message: string,
    debounceMs: number = 300
  ): AsyncValidationRule =>
    createAsyncValidationRule(validator, message, debounceMs)
};

/**
 * Validate a single value against validation rules
 */
export const validateValue = async (
  value: any,
  rules: ValidationRule[],
  formValues?: Record<string, any>
): Promise<string | undefined> => {
  for (const rule of rules) {
    try {
      const isValid = rule.test(value, formValues);
      if (!isValid) {
        return typeof rule.message === 'function' 
          ? rule.message(value, formValues)
          : rule.message;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return 'Validation error occurred';
    }
  }
  return undefined;
};

/**
 * Validate a single value against async validation rules
 */
export const validateValueAsync = async (
  value: any,
  rules: AsyncValidationRule[],
  formValues?: Record<string, any>
): Promise<string | undefined> => {
  for (const rule of rules) {
    try {
      const isValid = await rule.test(value, formValues);
      if (!isValid) {
        return typeof rule.message === 'function'
          ? rule.message(value, formValues)
          : rule.message;
      }
    } catch (error) {
      console.error('Async validation error:', error);
      return 'Validation error occurred';
    }
  }
  return undefined;
};
