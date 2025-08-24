import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Form, Badge, InputGroup, Button } from 'react-bootstrap';
import { X, Plus } from 'react-bootstrap-icons';
import { TagInputFieldConfig } from '@/types/forms/advanced';

interface TagInputFieldProps {
  field: TagInputFieldConfig;
  value: string[];
  error?: string;
  touched: boolean;
  onChange: (value: string[]) => void;
  onBlur: () => void;
}

const TagInputField: React.FC<TagInputFieldProps> = ({
  field,
  value = [],
  error,
  touched,
  onChange,
  onBlur
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const hasError = touched && !!error;
  const groupClass = `mb-3 ${field.styling?.customClasses?.group || ''}`.trim();
  const controlClass = `${field.styling?.customClasses?.control || ''} ${hasError ? 'is-invalid' : ''}`.trim();
  const labelClass = field.styling?.customClasses?.label || '';

  // Get separator characters
  const separators = React.useMemo(() => 
    Array.isArray(field.separator) ? field.separator : [field.separator || ','],
    [field.separator]
  );

  // Load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!field.suggestions) return;

      try {
        if (typeof field.suggestions === 'function') {
          const result = await field.suggestions();
          setSuggestions(result);
        } else {
          setSuggestions(field.suggestions);
        }
      } catch (error) {
        console.warn('Failed to load tag suggestions:', error);
        setSuggestions([]);
      }
    };

    loadSuggestions();
  }, [field]);

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim() || !suggestions.length) return [];
    
    const input = inputValue.toLowerCase().trim();
    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(input) && 
        !value.includes(suggestion)
      )
      .slice(0, 10); // Limit to 10 suggestions
  }, [inputValue, suggestions, value]);

  // Validate tag
  const isValidTag = useCallback((tag: string): boolean => {
    if (!tag.trim()) return false;
    if (value.includes(tag)) return false;
    if (field.maxTags && value.length >= field.maxTags) return false;
    if (field.tagPattern && !field.tagPattern.test(tag)) return false;
    if (!field.allowCustomTags && suggestions.length > 0 && !suggestions.includes(tag)) return false;
    
    return true;
  }, [value, field.maxTags, field.tagPattern, field.allowCustomTags, suggestions]);

  // Add tag
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (isValidTag(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  }, [value, onChange, isValidTag]);

  // Remove tag
  const removeTag = useCallback((index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  }, [value, onChange]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Check for separators
    const containsSeparator = separators.some(sep => newValue.includes(sep));
    
    if (containsSeparator) {
      // Split by all separators and add as tags
      let parts = [newValue];
      separators.forEach(sep => {
        parts = parts.flatMap(part => part.split(sep));
      });
      
      parts.forEach(part => {
        const trimmedPart = part.trim();
        if (trimmedPart && isValidTag(trimmedPart)) {
          addTag(trimmedPart);
        }
      });
      
      setInputValue('');
    } else {
      setInputValue(newValue);
      setShowSuggestions(newValue.trim().length > 0 && filteredSuggestions.length > 0);
      setActiveSuggestionIndex(-1);
    }
  }, [separators, isValidTag, addTag, filteredSuggestions.length]);

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
        if (!inputValue && value.length > 0) {
          removeTag(value.length - 1);
        }
        break;
    }
  }, [
    activeSuggestionIndex,
    filteredSuggestions,
    showSuggestions,
    inputValue,
    value,
    addTag,
    removeTag
  ]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  }, [addTag]);

  // Handle input blur
  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      
      // Add current input as tag if it exists and is valid
      if (inputValue.trim() && isValidTag(inputValue.trim())) {
        addTag(inputValue.trim());
      } else {
        setInputValue('');
      }
      
      onBlur();
    }, 150);
  }, [inputValue, isValidTag, addTag, onBlur]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (inputValue.trim() && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue, filteredSuggestions.length]);

  return (
    <Form.Group className={groupClass} controlId={field.name}>
      <Form.Label className={labelClass}>
        {field.label}
        {!field.required && <span className="form-label-secondary">(Optional)</span>}
        {field.maxTags && (
          <Badge bg="info" className="ms-2">
            {value.length}/{field.maxTags}
          </Badge>
        )}
      </Form.Label>

      {/* Tags display */}
      {value.length > 0 && (
        <div className="mb-2">
          {value.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              bg="primary"
              className="me-1 mb-1 d-inline-flex align-items-center"
              style={{ fontSize: '0.875rem' }}
            >
              {tag}
              {!field.readOnly && (
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  style={{ fontSize: '0.6rem' }}
                  onClick={() => removeTag(index)}
                  aria-label={`Remove ${tag}`}
                />
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="position-relative">
        <InputGroup>
          <Form.Control
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={field.placeholder || 'Type and press Enter to add tags...'}
            readOnly={field.readOnly}
            required={field.required && value.length === 0}
            className={controlClass}
            disabled={field.maxTags ? value.length >= field.maxTags : false}
          />
          
          {inputValue.trim() && !field.readOnly && (
            <Button
              variant="outline-secondary"
              onClick={() => addTag(inputValue.trim())}
              disabled={!isValidTag(inputValue.trim())}
            >
              <Plus size={16} />
            </Button>
          )}
        </InputGroup>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="position-absolute w-100 bg-white border rounded-bottom shadow-sm"
            style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={`
                  w-100 text-start px-3 py-2 border-0 bg-transparent
                  ${index === activeSuggestionIndex ? 'bg-primary text-white' : 'hover:bg-light'}
                `}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Help text and info */}
      <div className="d-flex justify-content-between align-items-start mt-1">
        <div>
          {field.helpText && (
            <Form.Text className="text-muted">{field.helpText}</Form.Text>
          )}
        </div>
        
        {field.maxTags && (
          <small className="text-muted">
            {value.length}/{field.maxTags} tags
          </small>
        )}
      </div>
      
      {hasError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </Form.Group>
  );
};

export default TagInputField;
