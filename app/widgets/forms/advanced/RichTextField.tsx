import React from 'react';
import striptags from 'striptags';
import type { RichTextFieldConfig } from '@/types/forms/advanced';
import type { FieldState } from '@/types/forms/styling';
import { TiptapEditor } from '../tiptap';
import {
  buildFieldClasses,
  generateFieldId,
  buildAriaDescribedBy,
  shouldShowOptionalText
} from '../utils';

interface RichTextFieldProps {
  field: RichTextFieldConfig;
  value: string;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const RichTextField: React.FC<RichTextFieldProps> = ({
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

  // Character count helper
  const getCharacterCount = () => {
    if (!field.maxLength) return null;
    
    // Strip HTML tags to get actual text length using secure striptags library
    const textContent = value ? striptags(value) : '';
    const currentLength = textContent.length;
    const isOverLimit = currentLength > field.maxLength;
    
    return (
      <div className={`form-text ${isOverLimit ? 'text-danger' : 'text-muted'}`}>
        {currentLength}/{field.maxLength} characters
      </div>
    );
  };

  return (
    <div className={classes.group}>
      <label htmlFor={fieldId} className={classes.label}>
        {field.label}
        {shouldShowOptionalText(field) && (
          <span className="form-label-secondary">(Optional)</span>
        )}
      </label>
      
      <TiptapEditor
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        toolbar={field.toolbar || 'basic'}
        height={field.height}
        placeholder={field.placeholder}
        readOnly={field.readOnly}
        className={fieldState.hasError ? 'border-danger' : ''}
      />
      
      {getCharacterCount()}
      
      {field.helpText && (
        <div id={helpTextId} className={classes.helpText}>
          {field.helpText}
        </div>
      )}
      
      {fieldState.hasError && error && (
        <div id={errorId} className="invalid-feedback d-block">
          {error}
        </div>
      )}

      {isValidating && (
        <div className="form-text text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Validating...</span>
          </div>
          Validating...
        </div>
      )}
    </div>
  );
};

export default RichTextField;