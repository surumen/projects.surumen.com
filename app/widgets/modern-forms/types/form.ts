import React from 'react';

export interface FormProps {
  children: React.ReactNode;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  className?: string;
  initialValues?: Record<string, any>;
  noValidate?: boolean;
}

export interface FormContextValue {
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  isValidating: Record<string, boolean>;
  
  setValue: (name: string, value: any) => void;
  setError: (name: string, error?: string) => void;
  setTouched: (name: string, touched?: boolean) => void;
  setValidating: (name: string, validating: boolean) => void;
  
  validateField: (name: string, triggerType?: 'change' | 'blur' | 'submit') => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  
  submit: () => Promise<void>;
  reset: (values?: Record<string, any>) => void;
  
  // Form state
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  
  // Field validation registration (Phase 3)
  registerFieldValidation?: (name: string, config: any) => void;
  unregisterFieldValidation?: (name: string) => void;
}

export interface FormState {
  values: Record<string, any>;
  initialValues: Record<string, any>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  isValidating: Record<string, boolean>;
  isSubmitting: boolean;
}
