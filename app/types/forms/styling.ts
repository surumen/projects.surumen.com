// app/types/forms/styling.ts
// Template-driven form styling system

import { ReactNode, ComponentType } from 'react';

// ========================
// INPUT GROUP CONFIGURATION
// ========================

export interface InputGroupAddon {
  icon?: ComponentType<any>;
  iconProps?: Record<string, any>;
  text?: string;
  content?: ReactNode;
}

export interface InputGroupConfig {
  prepend?: InputGroupAddon;
  append?: InputGroupAddon;
  merge?: boolean;
  variant?: 'default' | 'borderless' | 'light' | 'hover-light' | 'flush';
}

// ========================
// LABEL ICON CONFIGURATION
// ========================

export interface LabelIconConfig {
  icon?: ComponentType<any>;
  iconProps?: Record<string, any>;
  tooltip?: string;
  position?: 'after' | 'before';
  className?: string;
}

// ========================
// FIELD STYLING CONFIGURATION
// ========================

export interface FieldStyling {
  // Control variants matching your CSS templates
  variant?: 'default' | 'borderless' | 'light' | 'hover-light' | 'flush' | 'title';
  
  // Size variants
  size?: 'sm' | 'md' | 'lg';
  
  // Input group configuration
  inputGroup?: InputGroupConfig;
  
  // Label icon configuration
  labelIcon?: LabelIconConfig;
  
  // Layout options
  inline?: boolean; // For checkboxes/radios
  
  // Advanced customization
  customClasses?: {
    group?: string;
    label?: string;
    control?: string;
    helpText?: string;
    wrapper?: string;
  };
}

// ========================
// FIELD STATE FOR CLASS BUILDING
// ========================

export interface FieldState {
  hasError: boolean;
  touched: boolean;
  isValidating?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
}

// ========================
// CLASS MAP RESULT
// ========================

export interface ClassMap {
  group: string;
  label: string;
  control: string;
  helpText: string;
  wrapper?: string;
  inputGroup?: string;
  addon?: string;
}

// ========================
// TEMPLATE TYPES
// ========================

export type FieldTemplate = 
  | 'basic'           // Standard input/textarea/select
  | 'input-group'     // Input with prepend/append
  | 'switch'          // Switch toggle
  | 'checkbox'        // Checkbox field
  | 'radio'           // Radio field
  | 'checkbox-inline' // Inline checkboxes
  | 'radio-inline'    // Inline radios
  | 'radio-card';     // Card-style radio groups

export interface TemplateConfig {
  template: FieldTemplate;
  styling?: FieldStyling;
}
