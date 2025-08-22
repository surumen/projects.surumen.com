import React, { useState, useRef, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Calendar3, CalendarEvent, Clock } from 'react-bootstrap-icons';
import { DateFieldConfig } from '@/types/forms/advanced';

interface DateFieldProps {
  field: DateFieldConfig;
  value: string | Date;
  error?: string;
  touched: boolean;
  onChange: (value: string | Date) => void;
  onBlur: () => void;
}

const DateField: React.FC<DateFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = touched && !!error;
  const groupClass = `mb-3 ${field.styling?.customClasses?.group || ''}`.trim();
  const controlClass = `${field.styling?.customClasses?.control || ''} ${hasError ? 'is-invalid' : ''}`.trim();
  const labelClass = field.styling?.customClasses?.label || '';

  // Format date for display
  const formatDate = useCallback((date: string | Date, format: string = 'YYYY-MM-DD'): string => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
      default:
        if (field.showTime) {
          const timeFormat = field.timeFormat === '12h' ? 
            d.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }) :
            `${hours}:${minutes}`;
          return `${year}-${month}-${day} ${timeFormat}`;
        }
        return `${year}-${month}-${day}`;
    }
  }, [field.showTime, field.timeFormat]);

  // Parse input value to date
  const parseDate = useCallback((dateString: string): Date | null => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }, []);

  // Get current value as string
  const displayValue = value ? formatDate(value, field.format) : '';

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (!inputValue) {
      onChange('');
      return;
    }

    const parsedDate = parseDate(inputValue);
    if (parsedDate) {
      onChange(parsedDate);
    }
  };

  // Handle direct date selection (for future calendar integration)
  const handleDateSelect = (selectedDate: Date) => {
    onChange(selectedDate);
    setShowCalendar(false);
    inputRef.current?.focus();
  };

  // Get input type based on field configuration
  const getInputType = (): string => {
    if (field.showTime) {
      return 'datetime-local';
    }
    return 'date';
  };

  // Convert value for native input
  const getNativeValue = (): string => {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    if (field.showTime) {
      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      // Format for date input (YYYY-MM-DD)
      return date.toISOString().split('T')[0];
    }
  };

  // Validate date constraints
  const isDateValid = (checkDate: Date): boolean => {
    if (field.minDate) {
      const minDate = new Date(field.minDate);
      if (checkDate < minDate) return false;
    }
    
    if (field.maxDate) {
      const maxDate = new Date(field.maxDate);
      if (checkDate > maxDate) return false;
    }
    
    return true;
  };

  return (
    <Form.Group className={groupClass} controlId={field.name}>
      <Form.Label className={labelClass}>
        {field.label}
        {!field.required && <span className="form-label-secondary">(Optional)</span>}
      </Form.Label>

      <InputGroup>
        <Form.Control
          ref={inputRef}
          type={getInputType()}
          value={getNativeValue()}
          onChange={handleInputChange}
          onBlur={onBlur}
          readOnly={field.readOnly}
          required={field.required}
          placeholder={field.placeholder}
          className={controlClass}
          min={field.minDate ? new Date(field.minDate).toISOString().split('T')[0] : undefined}
          max={field.maxDate ? new Date(field.maxDate).toISOString().split('T')[0] : undefined}
        />
        
        <Button
          variant="outline-secondary"
          onClick={() => setShowCalendar(!showCalendar)}
          disabled={field.readOnly}
          aria-label="Open calendar"
        >
          {field.showTime ? <CalendarEvent size={16} /> : <Calendar3 size={16} />}
        </Button>
      </InputGroup>

      {field.helpText && (
        <Form.Text className="text-muted">{field.helpText}</Form.Text>
      )}
      
      {hasError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}

      {/* Future: Add custom calendar picker here */}
      {showCalendar && (
        <div className="mt-2 p-2 border rounded bg-light">
          <small className="text-muted">
            📅 Custom calendar picker coming soon! For now, use the native date picker above.
          </small>
        </div>
      )}
    </Form.Group>
  );
};

export default DateField;
