// app/widgets/forms/utils/classBuilders.ts
// Template-driven class building system

import type { FieldConfig } from '@/types/forms/advanced';
import type { FieldState, ClassMap, FieldStyling } from '@/types/forms/styling';

// ========================
// BASE CLASS BUILDERS
// ========================

/**
 * Build form group wrapper classes
 */
export const buildGroupClasses = (field: FieldConfig): string => {
  const classes = ['mb-3'];
  
  // Add custom group classes
  if (field.styling?.customClasses?.group) {
    classes.push(field.styling.customClasses.group);
  }
  
  return classes.join(' ');
};

/**
 * Build form label classes
 */
export const buildLabelClasses = (field: FieldConfig): string => {
  const classes = ['form-label'];
  
  // Add custom label classes
  if (field.styling?.customClasses?.label) {
    classes.push(field.styling.customClasses.label);
  }
  
  return classes.join(' ');
};

/**
 * Build form control classes based on field type and styling
 */
export const buildControlClasses = (field: FieldConfig, state: FieldState): string => {
  const { type, styling } = field;
  const { hasError, isDisabled } = state;
  
  let baseClass = 'form-control';
  
  // Handle different field types
  if (type === 'select') {
    baseClass = 'form-select';
  }
  
  const classes = [baseClass];
  
  // Add variant classes
  if (styling?.variant && styling.variant !== 'default') {
    switch (styling.variant) {
      case 'borderless':
        if (type === 'select') {
          classes.push('form-select-borderless');
        } else {
          classes.push('form-control-borderless', 'form-control-flush');
        }
        break;
      case 'light':
        if (type === 'select') {
          classes.push('form-select-light');
        } else {
          classes.push('form-control-light');
        }
        break;
      case 'hover-light':
        if (type === 'select') {
          classes.push('form-select-hover-light');
        } else {
          classes.push('form-control-hover-light');
        }
        break;
      case 'flush':
        classes.push('form-control-flush');
        break;
      case 'title':
        classes.push('form-control-title');
        break;
    }
  }
  
  // Add size classes
  if (styling?.size && styling.size !== 'md') {
    if (type === 'select') {
      classes.push(`form-select-${styling.size}`);
    } else {
      classes.push(`form-control-${styling.size}`);
    }
  }
  
  // Add state classes
  if (hasError) {
    classes.push('is-invalid');
  }
  
  if (isDisabled) {
    classes.push('disabled');
  }
  
  // Add custom control classes
  if (styling?.customClasses?.control) {
    classes.push(styling.customClasses.control);
  }
  
  return classes.join(' ');
};

/**
 * Build input group wrapper classes
 */
export const buildInputGroupClasses = (field: FieldConfig): string => {
  const { styling } = field;
  const { inputGroup } = styling || {};
  
  if (!inputGroup) return '';
  
  const classes = ['input-group'];
  
  // Add merge class
  if (inputGroup.merge) {
    classes.push('input-group-merge');
  }
  
  // Add variant classes
  if (inputGroup.variant && inputGroup.variant !== 'default') {
    switch (inputGroup.variant) {
      case 'borderless':
        classes.push('input-group-borderless', 'input-group-flush');
        break;
      case 'light':
        classes.push('input-group-light');
        break;
      case 'hover-light':
        classes.push('input-group-hover-light');
        break;
      case 'flush':
        classes.push('input-group-flush');
        break;
    }
  }
  
  return classes.join(' ');
};

/**
 * Build help text classes
 */
export const buildHelpTextClasses = (field: FieldConfig): string => {
  const classes = ['form-text'];
  
  // Add custom help text classes
  if (field.styling?.customClasses?.helpText) {
    classes.push(field.styling.customClasses.helpText);
  }
  
  return classes.join(' ');
};

/**
 * Build checkbox/radio specific classes
 */
export const buildCheckboxRadioClasses = (field: FieldConfig, isInline: boolean = false): string => {
  const classes = ['form-check'];
  
  if (isInline || field.styling?.inline) {
    classes.push('form-check-inline');
  }
  
  if (field.type === 'switch') {
    classes.push('form-switch');
  }
  
  // Add margin bottom for non-inline items
  if (!isInline && !field.styling?.inline) {
    classes.push('mb-3');
  }
  
  return classes.join(' ');
};

// ========================
// COMPREHENSIVE CLASS MAP BUILDER
// ========================

/**
 * Build complete class map for a field
 */
export const buildFieldClasses = (field: FieldConfig, state: FieldState): ClassMap => {
  return {
    group: buildGroupClasses(field),
    label: buildLabelClasses(field),
    control: buildControlClasses(field, state),
    helpText: buildHelpTextClasses(field),
    inputGroup: buildInputGroupClasses(field),
    addon: 'input-group-text'
  };
};

// ========================
// TEMPLATE-SPECIFIC BUILDERS
// ========================

/**
 * Build classes specifically for input group templates
 */
export const buildInputGroupTemplateClasses = (field: FieldConfig, state: FieldState) => {
  const baseClasses = buildFieldClasses(field, state);
  
  return {
    ...baseClasses,
    prependAddon: 'input-group-prepend input-group-text',
    appendAddon: 'input-group-append input-group-text'
  };
};

/**
 * Build classes for switch template
 */
export const buildSwitchTemplateClasses = (field: FieldConfig, state: FieldState) => {
  return {
    group: buildCheckboxRadioClasses(field),
    input: 'form-check-input',
    label: 'form-check-label',
    helpText: 'text-muted',
    invalidFeedback: 'invalid-feedback d-block'
  };
};

/**
 * Build classes for checkbox/radio template
 */
export const buildCheckboxRadioTemplateClasses = (field: FieldConfig, state: FieldState, isInline: boolean = false) => {
  return {
    group: buildCheckboxRadioClasses(field, isInline),
    input: 'form-check-input',
    label: 'form-check-label',
    helpText: 'text-muted',
    invalidFeedback: 'invalid-feedback d-block'
  };
};
