import React from 'react';
import { ValidationRule, AsyncValidationRule } from './validation';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'textarea' 
  | 'search' 
  | 'date' 
  | 'time' 
  | 'color' 
  | 'range';

export interface FieldProps {
  // Core Identity
  name: string;
  label?: string;
  type?: FieldType;
  
  // Values & State
  defaultValue?: any;
  value?: any; // Controlled mode
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  
  // UI & UX
  placeholder?: string;
  helpText?: string;
  autoFocus?: boolean;
  className?: string; // Bootstrap variants & custom classes
  
  // Layout
  columns?: number; // For FieldGroup (1-12)
  rows?: number; // For textarea
  
  // Validation Control
  updateOn?: 'change' | 'blur' | 'submit';
  validators?: ValidationRule[];
  asyncValidators?: AsyncValidationRule[];
  deps?: string[]; // Field dependencies
  
  // HTML Attributes
  maxLength?: number;
  minLength?: number;
  pattern?: string; // Regex pattern
  min?: number | string; // Min value
  max?: number | string; // Max value
  step?: number | string; // Step increment
  autoComplete?: string;
  tabIndex?: number;
  
  // Data Processing
  transform?: (value: any) => any; // Transform before storing
  parse?: (value: string) => any; // Parse string to type
  
  // Event Handlers
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export interface FieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

export interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string; // Label for the input group
  helpText?: string; // Help text for the input group
}

export interface InputGroupPrefixProps {
  children: React.ReactNode;
  type?: 'text' | 'button';
  className?: string;
}

export interface InputGroupSuffixProps {
  children: React.ReactNode;
  type?: 'text' | 'button';
  className?: string;
}

export interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
  isValidating: boolean;
  isPristine: boolean;
}
