import { ReactNode } from 'react';
import { FieldStyling, TemplateConfig } from './styling';

// ========================
// BASIC FORM TYPES
// ========================

export type Option = { 
  value: string | number; 
  label: string; 
};

export type FieldType = 'input' | 'select' | 'switch' | 'textarea' | 'date' | 'file' | 'tags' | 'richtext';

// ========================
// ADVANCED FORM TYPES
// ========================

export type ValidationRule = {
  test: (value: any, formValues?: Record<string, any>) => boolean;
  message: string | ((value: any, formValues?: Record<string, any>) => string);
};

export type AsyncValidationRule = {
  test: (value: any, formValues?: Record<string, any>) => Promise<boolean>;
  message: string | ((value: any, formValues?: Record<string, any>) => string);
  debounceMs?: number;
};

export type ConditionalLogic = {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'not_require';
};

// ========================
// EXTENDED FIELD TYPES
// ========================

export interface DateFieldConfig {
  type: 'date';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: string | Date;
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Date-specific options
  minDate?: string | Date;
  maxDate?: string | Date;
  format?: string; // 'YYYY-MM-DD', 'MM/DD/YYYY', etc.
  showTime?: boolean;
  timeFormat?: '12h' | '24h';
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface FileUploadFieldConfig {
  type: 'file';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: File | File[] | string | string[];
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // File-specific options
  multiple?: boolean;
  accept?: string; // MIME types: 'image/*', '.pdf', etc.
  maxSize?: number; // in bytes
  maxFiles?: number;
  showPreview?: boolean;
  uploadUrl?: string;
  onUploadProgress?: (progress: number) => void;
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface TagInputFieldConfig {
  type: 'tags';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: string[];
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Tag-specific options
  suggestions?: string[] | (() => Promise<string[]>);
  allowCustomTags?: boolean;
  maxTags?: number;
  tagPattern?: RegExp;
  separator?: string | string[]; // Characters that trigger tag creation
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface RichTextFieldConfig {
  type: 'richtext';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: string;
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Rich text specific options
  height?: number;
  toolbar?: 'basic' | 'standard' | 'full';
  maxLength?: number;
  
  // Template-driven styling
  styling?: FieldStyling;
}

// ========================
// BASE FIELD TYPES
// ========================

export interface InputFieldConfig {
  type: 'input';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: any;
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Input-specific options
  inputType?: React.HTMLInputTypeAttribute;
  mask?: string; // Input masking pattern
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  suggestions?: string[] | (() => Promise<string[]>);
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface SelectFieldConfig {
  type: 'select';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: any;
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Select-specific options
  options: Option[] | (() => Promise<Option[]>);
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  createOption?: boolean;
  maxSelections?: number;
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface TextareaFieldConfig {
  type: 'textarea';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: string;
  placeholder?: string;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Textarea-specific options
  rows?: number;
  maxLength?: number;
  
  // Template-driven styling
  styling?: FieldStyling;
}

export interface SwitchFieldConfig {
  type: 'switch';
  name: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: ValidationRule[];
  asyncValidate?: AsyncValidationRule[];
  initialValue?: boolean;
  helpText?: string;
  conditionalLogic?: ConditionalLogic[];
  
  // Layout configuration
  row?: {
    columns: 1 | 2 | 3 | 4 | 6 | 12;
  };
  
  // Switch-specific options
  size?: 'sm' | 'md' | 'lg';
  
  // Template-driven styling
  styling?: FieldStyling;
}

// ========================
// FORM BUILDER TYPES
// ========================

export type FieldConfig = 
  | InputFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | FileUploadFieldConfig
  | TagInputFieldConfig
  | RichTextFieldConfig;

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'admin' | 'user' | 'survey' | 'cms' | 'custom';
  fields: FieldConfig[];
  validation?: {
    rules: ValidationRule[];
    asyncRules?: AsyncValidationRule[];
  };
  styling?: {
    layout: 'vertical' | 'horizontal' | 'inline' | 'grid';
    theme: 'default' | 'minimal' | 'card' | 'steps';
    columns?: number;
  };
  behavior?: {
    autoSave?: boolean;
    autoSaveInterval?: number;
    showProgress?: boolean;
    allowDrafts?: boolean;
    confirmOnLeave?: boolean;
  };
  metadata?: {
    created: Date;
    updated: Date;
    version: string;
    author: string;
  };
}

export interface FormDraft {
  id: string;
  formId: string;
  values: Record<string, any>;
  savedAt: Date;
  expiresAt?: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  values: Record<string, any>;
  submittedAt: Date;
  submittedBy?: string;
  metadata?: Record<string, any>;
}

// ========================
// FORM CONTEXT TYPES
// ========================

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  asyncValidating: Record<string, boolean>;
  submitCount: number;
}

export interface FormActions {
  setValue: (name: string, value: any) => void;
  setValues: (values: Record<string, any>) => void;
  setError: (name: string, error: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  setTouched: (name: string, touched?: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  reset: (values?: Record<string, any>) => void;
  submit: () => Promise<void>;
  validateField: (name: string) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}

export interface FormConfig {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  validation?: {
    mode: 'onChange' | 'onBlur' | 'onSubmit' | 'all';
    revalidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  };
  persistence?: {
    key: string;
    autoSave?: boolean;
    autoSaveInterval?: number;
    storageType?: 'localStorage' | 'sessionStorage' | 'indexedDB';
  };
  behavior?: {
    confirmOnLeave?: boolean;
    resetOnSuccess?: boolean;
    clearOnSuccess?: boolean;
  };
}

export interface SmartFormProps {
  config: FormConfig;
  template?: FormTemplate;
  className?: string;
  onFieldChange?: (name: string, value: any, allValues: Record<string, any>) => void;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
  renderSubmitButton?: (props: {
    isValid: boolean;
    isSubmitting: boolean;
    isDirty: boolean;
    values: Record<string, any>;
    submit: () => void;
  }) => ReactNode;
}
