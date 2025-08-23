// app/widgets/forms/templates/InputGroupTemplate.tsx
// Template for input groups with prepend/append icons and text

import React from 'react';
import type { FieldConfig } from '@/types/forms/advanced';
import type { FieldState } from '@/types/forms/styling';
import {
  buildInputGroupTemplateClasses,
  generateFieldId,
  buildAriaDescribedBy,
  shouldShowOptionalText,
  renderAddon
} from '../utils';

interface InputGroupTemplateProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const InputGroupTemplate: React.FC<InputGroupTemplateProps> = ({
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

  const classes = buildInputGroupTemplateClasses(field, fieldState);
  const fieldId = generateFieldId(field.name);
  const helpTextId = field.helpText ? `${field.name}_help` : undefined;
  const errorId = fieldState.hasError ? `${field.name}_error` : undefined;
  const ariaDescribedBy = buildAriaDescribedBy(field.name, !!field.helpText, fieldState.hasError);
  
  const { inputGroup } = field.styling || {};
  const prependId = inputGroup?.prepend ? `${field.name}PrependAddOn` : undefined;
  const appendId = inputGroup?.append ? `${field.name}AppendAddOn` : undefined;

  const controlProps = {
    id: fieldId,
    name: field.name,
    disabled: field.readOnly,
    required: field.required,
    className: classes.control,
    'aria-invalid': fieldState.hasError,
    'aria-describedby': [ariaDescribedBy, prependId, appendId].filter(Boolean).join(' ') || undefined
  };

  const renderControl = () => {
    switch (field.type) {
      case 'input':
        return (
          <input
            {...controlProps}
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
            {...controlProps}
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
            {...controlProps}
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
          <span className="form-label-secondary ms-1">(Optional)</span>
        )}
      </label>
      
      <div className={classes.inputGroup}>
        {inputGroup?.prepend && (
          <div id={prependId} className={classes.prependAddon}>
            {renderAddon(inputGroup.prepend)}
          </div>
        )}
        
        {renderControl()}
        
        {inputGroup?.append && (
          <div id={appendId} className={classes.appendAddon}>
            {renderAddon(inputGroup.append)}
          </div>
        )}
      </div>
      
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

export default InputGroupTemplate;
