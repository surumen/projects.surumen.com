// app/widgets/forms/templates/SwitchTemplate.tsx
// Template for switch/toggle fields

import React from 'react';
import type { FieldConfig } from '@/types/forms/advanced';
import type { FieldState } from '@/types/forms/styling';
import {
  buildSwitchTemplateClasses,
  generateFieldId,
  shouldShowOptionalText
} from '../utils';

interface SwitchTemplateProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const SwitchTemplate: React.FC<SwitchTemplateProps> = ({
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

  const classes = buildSwitchTemplateClasses(field, fieldState);
  const fieldId = generateFieldId(field.name);
  const helpTextId = field.helpText ? `${field.name}_help` : undefined;
  const errorId = fieldState.hasError ? `${field.name}_error` : undefined;

  const ariaDescribedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  // Check if inline layout is requested
  const isInline = field.styling?.inline;

  if (isInline) {
    // Inline row layout like your example
    return (
      <div className="mb-3">
        <label htmlFor={fieldId} className="row form-check form-switch">
          <span className="col-8 col-sm-9 ms-0">
            <span className="text-dark">
              {field.label}
              {shouldShowOptionalText(field) && (
                <span className="form-label-secondary ms-1">(Optional)</span>
              )}
            </span>
          </span>
          <span className="col-4 col-sm-3 text-end">
            <input
              type="checkbox"
              id={fieldId}
              name={field.name}
              className="form-check-input"
              role="switch"
              checked={!!value}
              disabled={field.readOnly}
              required={field.required}
              aria-invalid={fieldState.hasError}
              aria-describedby={ariaDescribedBy}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
            />
          </span>
        </label>
        
        {field.helpText && (
          <div id={helpTextId} className="text-muted small">
            {field.helpText}
          </div>
        )}
        
        {fieldState.hasError && error && (
          <div id={errorId} className="invalid-feedback d-block">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Default vertical layout
  return (
    <div className={classes.group}>
      <input
        type="checkbox"
        id={fieldId}
        name={field.name}
        className={classes.input}
        role="switch"
        checked={!!value}
        disabled={field.readOnly}
        required={field.required}
        aria-invalid={fieldState.hasError}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
      />
      
      <label htmlFor={fieldId} className={classes.label}>
        {field.label}
        {shouldShowOptionalText(field) && (
          <span className="form-label-secondary ms-1">(Optional)</span>
        )}
      </label>
      
      {field.helpText && (
        <div id={helpTextId} className={classes.helpText}>
          {field.helpText}
        </div>
      )}
      
      {fieldState.hasError && error && (
        <div id={errorId} className={classes.invalidFeedback}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SwitchTemplate;
