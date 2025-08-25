// Validation types for modern forms

export interface ValidationRule {
  test: (value: any, formValues?: Record<string, any>) => boolean;
  message: string | ((value: any, formValues?: Record<string, any>) => string);
}

export interface AsyncValidationRule {
  test: (value: any, formValues?: Record<string, any>) => Promise<boolean>;
  message: string | ((value: any, formValues?: Record<string, any>) => string);
  debounceMs?: number;
}

export interface ValidationConfig {
  validators?: ValidationRule[];
  asyncValidators?: AsyncValidationRule[];
  deps?: string[]; // Field dependencies
  updateOn?: 'change' | 'blur' | 'submit';
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  isValidating: Record<string, boolean>;
}
