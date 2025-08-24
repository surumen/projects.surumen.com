import React from 'react';
import { FieldProps } from './field';

// Common option interface for select-based components
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// SelectField component props
export interface SelectFieldProps extends Omit<FieldProps, 'type'> {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  allowCustomOptions?: boolean;
  placeholder?: string;
  hideSearch?: boolean;
  dropdownWidth?: string;
  dropdownLeft?: boolean;
  maxItems?: number;
  loading?: boolean;
  loadingText?: string;
  noResultsText?: string;
  onSearch?: (query: string) => void;
  onCreate?: (input: string) => SelectOption | Promise<SelectOption>;
}

// SwitchField component props
export interface SwitchFieldProps extends Omit<FieldProps, 'type' | 'placeholder'> {
  inline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// CheckboxField component props
export interface CheckboxFieldProps extends Omit<FieldProps, 'type' | 'placeholder'> {
  inline?: boolean;
  indeterminate?: boolean;
}

// TagsField component props (extends SelectField)
export interface TagsFieldProps extends Omit<SelectFieldProps, 'multiple'> {
  suggestions?: string[] | SelectOption[];
  maxTags?: number;
  allowDuplicates?: boolean;
  tagValidator?: (tag: string) => boolean | string;
  tagTransform?: (tag: string) => string;
}

// DateField component props
export interface DateFieldProps extends Omit<FieldProps, 'type'> {
  mode?: 'single' | 'multiple' | 'range';
  enableTime?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  defaultDate?: string | Date | string[] | Date[];
  disable?: string[] | Date[] | ((date: Date) => boolean);
  enable?: string[] | Date[] | ((date: Date) => boolean);
  inline?: boolean;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  altInput?: boolean;
  altFormat?: string;
  weekNumbers?: boolean;
  allowInput?: boolean;
  clickOpens?: boolean;
  locale?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onReady?: () => void;
}

// Radio group option
export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  helpText?: string;
}

// RadioGroupField component props
export interface RadioGroupFieldProps extends Omit<FieldProps, 'type' | 'placeholder'> {
  options: RadioOption[];
  inline?: boolean;
  direction?: 'horizontal' | 'vertical';
}
