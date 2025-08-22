// app/widgets/forms/templates/BasicFieldTemplate.tsx
// Template for standard input, textarea, and select fields

import React from 'react';
import type { FieldConfig } from '@/types/forms/advanced';
import type { FieldState } from '@/types/forms/styling';
import {
  buildFieldClasses,
  generateFieldId,
  buildAriaDescribedBy,
  shouldShowOptionalText,
  getCommonControlProps
} from '../utils';

interface BasicFieldTemplateProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const BasicFieldTemplate: React.FC<BasicFieldTemplateProps> = ({
  field,
  value,
  error,
  touched,
  isValidating,
  onChange,
  onBlur
}) => {
  const fieldState: FieldState = {
    hasError: touched && !!error,
    touched,
    isValidating,
    isDisabled: field.readOnly,
    isFocused: false
  };

  const classes = buildFieldClasses(field, fieldState);
  const fieldId = generateFieldId(field.name);
  const helpTextId = field.helpText ? `${field.name}_help` : undefined;
  const errorId = fieldState.hasError ? `${field.name}_error` : undefined;
  const ariaDescribedBy = buildAriaDescribedBy(field.name, !!field.helpText, fieldState.hasError);

  const commonProps = {
    id: fieldId,
    name: field.name,
    disabled: field.readOnly,
    required: field.required,
    className: classes.control,
    'aria-invalid': fieldState.hasError,
    'aria-describedby': ariaDescribedBy
  };

  const renderControl = () => {
    switch (field.type) {
      case 'input':
        return (
          <input
            {...commonProps}
            type={field.inputType || 'text'}
            value={value || ''}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            minLength={field.minLength}
            pattern={field.pattern}
            autoComplete={field.autoComplete}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
        );

      case 'select':
        const options = Array.isArray(field.options) ? field.options : [];
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          >
            <option value="" disabled>
              {field.placeholder || '— select —'}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={classes.group}>
      <label htmlFor={fieldId} className={classes.label}>
        {field.label}
        {shouldShowOptionalText(field) && (
          <span className="form-label-secondary">(Optional)</span>
        )}
      </label>
      
      {renderControl()}
      
      {field.helpText && (
        <span id={helpTextId} className={classes.helpText}>
          {field.helpText}
        </span>
      )}
      
      {fieldState.hasError && error && (
        <div id={errorId} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

export default BasicFieldTemplate;
