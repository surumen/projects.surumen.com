import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TagsFieldProps } from '../types/advanced';
import { useFormContext } from '../core/Form';
import { useField } from '../../../hooks/forms/useField';
import { generateFieldId } from '../utils/fieldHelpers';
import { classNames } from '../utils/classNames';

/**
 * TagsField component - Tag input with suggestions and validation
 * 
 * Generates HTML structure:
 * <div class="mb-3">
 *   <label class="form-label" for="field_name">Label *</label>
 *   
 *   <!-- Tags display -->
 *   <div class="mb-2"> (if tags exist)
 *     <span class="badge bg-primary me-1 mb-1">
 *       Tag Name
 *       <button class="btn-close btn-close-white ms-1" type="button"></button>
 *     </span>
 *   </div>
 *   
 *   <!-- Input with suggestions -->
 *   <div class="position-relative">
 *     <input type="text" class="form-control" placeholder="Add tags...">
 *     <div class="position-absolute w-100 bg-white border rounded-bottom shadow-sm"> (if suggestions)
 *       <button class="w-100 text-start px-3 py-2 border-0 bg-transparent">Suggestion</button>
 *     </div>
 *   </div>
 *   
 *   <div class="form-text">Help text</div>
 * </div>
 */
export const TagsField: React.FC<TagsFieldProps> = ({
  name,
  label,
  defaultValue = [],
  value: controlledValue,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  placeholder = 'Type and press Enter to add tags...',
  helpText,
  className,
  options = [], // From SelectField - treated as suggestions
  suggestions,
  maxTags,
  allowDuplicates = false,
  allowCustomOptions = true,
  tagValidator,
  tagTransform,
  validators = [],
  asyncValidators = [],
  deps = [],
  updateOn = 'change',
  transform,
  onChange,
  onBlur,
  onFocus,
  ariaLabel,
  ariaDescribedBy,
  ...rest
}) => {
  // Form integration
  const formContext = useFormContext();
  const fieldId = generateFieldId(name);
  
  // Local state for input and suggestions
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use field hook for form integration
  const { 
    value: fieldValue, 
    error: fieldError, 
    touched, 
    isValidating,
    handleBlur: fieldHandleBlur 
  } = useField({
    name,
    defaultValue,
    transform,
    onChange,
    onBlur,
    updateOn,
    validators,
    asyncValidators,
    deps,
    formValues: formContext.values,
    formErrors: formContext.errors,
    formTouched: formContext.touched,
    formIsValidating: formContext.isValidating,
    setValue: formContext.setValue,
    setTouched: formContext.setTouched,
    validateField: formContext.validateField,
    registerFieldValidation: formContext.registerFieldValidation,
    unregisterFieldValidation: formContext.unregisterFieldValidation
  });

  // Current field state - wrap in useMemo to fix React warnings
  const currentValue: string[] = React.useMemo(() => {
    return controlledValue !== undefined ? controlledValue : (fieldValue || []);
  }, [controlledValue, fieldValue]);
  
  const currentError = error || (touched ? fieldError : undefined);
  
  // Process suggestions from both suggestions prop and options prop
  const processedSuggestions = React.useMemo(() => {
    const allSuggestions: string[] = [];
    
    // Add from options prop (SelectField compatibility)
    if (options && options.length > 0) {
      options.forEach(option => {
        // TypeScript knows option is SelectOption here
        allSuggestions.push(option.label);
      });
    }
    
    // Add from suggestions prop
    if (suggestions && suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const suggestionStr = typeof suggestion === 'string' ? suggestion : suggestion.label;
        if (!allSuggestions.includes(suggestionStr)) {
          allSuggestions.push(suggestionStr);
        }
      });
    }
    
    return allSuggestions;
  }, [options, suggestions]);

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim() || !processedSuggestions.length) return [];
    
    const input = inputValue.toLowerCase().trim();
    return processedSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(input) && 
        (allowDuplicates || !currentValue.includes(suggestion))
      )
      .slice(0, 10); // Limit to 10 suggestions
  }, [inputValue, processedSuggestions, currentValue, allowDuplicates]);

  // Validate tag
  const isValidTag = useCallback((tag: string): { valid: boolean; error?: string } => {
    const trimmedTag = tag.trim();
    
    if (!trimmedTag) {
      return { valid: false, error: 'Tag cannot be empty' };
    }
    
    if (!allowDuplicates && currentValue.includes(trimmedTag)) {
      return { valid: false, error: 'Tag already exists' };
    }
    
    if (maxTags && currentValue.length >= maxTags) {
      return { valid: false, error: `Maximum ${maxTags} tags allowed` };
    }
    
    if (tagValidator) {
      const result = tagValidator(trimmedTag);
      if (result === false) {
        return { valid: false, error: 'Invalid tag format' };
      }
      if (typeof result === 'string') {
        return { valid: false, error: result };
      }
    }
    
    if (!allowCustomOptions && processedSuggestions.length > 0 && !processedSuggestions.includes(trimmedTag)) {
      return { valid: false, error: 'Please select from suggestions only' };
    }
    
    return { valid: true };
  }, [currentValue, maxTags, allowDuplicates, tagValidator, allowCustomOptions, processedSuggestions]);

  // Add tag
  const addTag = useCallback(async (tag: string) => {
    let processedTag = tag.trim();
    
    // Apply tag transform if provided
    if (tagTransform) {
      processedTag = tagTransform(processedTag);
    }
    
    const validation = isValidTag(processedTag);
    if (!validation.valid) {
      console.warn('Invalid tag:', validation.error);
      return false;
    }
    
    const newTags = [...currentValue, processedTag];
    
    // Apply field transform if provided
    const transformedValue = transform ? transform(newTags) : newTags;
    
    // Update form state
    formContext.setValue(name, transformedValue);
    
    // Validate field if needed
    if (updateOn === 'change') {
      await formContext.validateField(name, 'change');
    }
    
    // Clear input and suggestions
    setInputValue('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    // Call external onChange
    if (onChange) {
      onChange(transformedValue);
    }
    
    return true;
  }, [currentValue, tagTransform, isValidTag, transform, formContext, name, updateOn, onChange]);

  // Remove tag
  const removeTag = useCallback(async (index: number) => {
    const newTags = currentValue.filter((_, i) => i !== index);
    
    // Apply field transform if provided
    const transformedValue = transform ? transform(newTags) : newTags;
    
    // Update form state
    formContext.setValue(name, transformedValue);
    
    // Validate field if needed
    if (updateOn === 'change') {
      await formContext.validateField(name, 'change');
    }
    
    // Call external onChange
    if (onChange) {
      onChange(transformedValue);
    }
  }, [currentValue, transform, formContext, name, updateOn, onChange]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Check for common separators (comma, semicolon)
    const separators = [',', ';'];
    const containsSeparator = separators.some(sep => newValue.includes(sep));
    
    if (containsSeparator) {
      // Split by all separators and add as tags
      let parts = [newValue];
      separators.forEach(sep => {
        parts = parts.flatMap(part => part.split(sep));
      });
      
      // Add all valid parts as tags
      parts.forEach(part => {
        const trimmedPart = part.trim();
        if (trimmedPart && isValidTag(trimmedPart).valid) {
          addTag(trimmedPart);
        }
      });
      
      setInputValue('');
    } else {
      setInputValue(newValue);
      setShowSuggestions(newValue.trim().length > 0 && filteredSuggestions.length > 0);
      setActiveSuggestionIndex(-1);
    }
  }, [isValidTag, addTag, filteredSuggestions.length]);

  // Handle key down
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
          addTag(filteredSuggestions[activeSuggestionIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setActiveSuggestionIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions && filteredSuggestions.length > 0) {
          setActiveSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
        
      case 'Backspace':
        if (!inputValue && currentValue.length > 0) {
          removeTag(currentValue.length - 1);
        }
        break;
        
      case 'Tab':
        if (showSuggestions && activeSuggestionIndex >= 0) {
          e.preventDefault();
          addTag(filteredSuggestions[activeSuggestionIndex]);
        }
        break;
    }
  }, [
    activeSuggestionIndex,
    filteredSuggestions,
    showSuggestions,
    inputValue,
    currentValue,
    addTag,
    removeTag
  ]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  }, [addTag]);

  // Handle input blur
  const handleInputBlur = useCallback(async () => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      
      // Add current input as tag if valid
      if (inputValue.trim() && isValidTag(inputValue.trim()).valid) {
        addTag(inputValue.trim());
      } else {
        setInputValue('');
      }
      
      // Call field blur handler
      fieldHandleBlur();
    }, 150);
  }, [inputValue, isValidTag, addTag, fieldHandleBlur]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (inputValue.trim() && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
    
    if (onFocus) {
      onFocus();
    }
  }, [inputValue, filteredSuggestions.length, onFocus]);

  // Generate input classes
  const inputClasses = classNames(
    'form-control',
    className,
    !!currentError && 'is-invalid'
  );

  // Accessibility attributes
  const helpTextId = helpText ? `${fieldId}_help` : undefined;
  const errorId = currentError ? `${fieldId}_error` : undefined;
  const describedBy = [helpTextId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  // Render label
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label className="form-label" htmlFor={fieldId}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
        {maxTags && (
          <small className="badge bg-info ms-2">
            {currentValue.length}/{maxTags}
          </small>
        )}
      </label>
    );
  };

  // Render tags display
  const renderTags = () => {
    if (currentValue.length === 0) return null;
    
    return (
      <div className="mb-2">
        {currentValue.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="badge bg-primary me-1 mb-1"
            style={{ fontSize: '0.875rem' }}
          >
            {tag}
            {!readOnly && !disabled && (
              <button
                type="button"
                className="btn-close btn-close-white ms-1"
                style={{ fontSize: '0.6rem' }}
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
              />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Render suggestions dropdown
  const renderSuggestions = () => {
    if (!showSuggestions || !filteredSuggestions.length) return null;
    
    return (
      <div
        className="position-absolute w-100 bg-white border rounded-bottom shadow-sm"
        style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            className={classNames(
              'w-100 text-start px-3 py-2 border-0 bg-transparent',
              index === activeSuggestionIndex ? 'bg-primary text-white' : 'hover:bg-light'
            )}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={() => setActiveSuggestionIndex(index)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  // Render validation state
  const renderValidationState = () => {
    if (isValidating) {
      return (
        <div className="form-text">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Validating...
        </div>
      );
    }

    if (currentError || helpText) {
      return (
        <div
          id={currentError ? errorId : helpTextId}
          className={classNames(
            currentError ? 'invalid-feedback d-block' : 'form-text'
          )}
        >
          {currentError || helpText}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-3">
      {renderLabel()}
      {renderTags()}
      
      <div className="position-relative">
        <input
          ref={inputRef}
          type="text"
          id={fieldId}
          name={name}
          className={inputClasses}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || readOnly || (maxTags ? currentValue.length >= maxTags : false)}
          required={required && currentValue.length === 0}
          aria-invalid={!!currentError}
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          autoComplete="off"
          {...rest}
        />
        
        {renderSuggestions()}
      </div>
      
      {renderValidationState()}
    </div>
  );
};

export default TagsField;
