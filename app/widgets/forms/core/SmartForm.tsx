import React, { useCallback, useMemo } from 'react';
import { Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { FormProvider, useFormContext, useFormStatus } from './FormProvider';
import { SmartFormProps, FieldConfig } from '@/types/forms/advanced';

// Import field components
import DateField from '../advanced/DateField';
import FileUploadField from '../advanced/FileUploadField';
import TagInputField from '../advanced/TagInputField';
import RichTextField from '../advanced/RichTextField';
import { TemplateRenderer } from '../templates';

// ========================
// SMART FIELD RENDERER
// ========================

interface SmartFieldRendererProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const SmartFieldRenderer: React.FC<SmartFieldRendererProps> = ({
  field,
  value,
  error,
  touched,
  isValidating,
  onChange,
  onBlur
}) => {
  // Check conditional logic
  const { values } = useFormContext();
  const isVisible = useMemo(() => {
    if (!field.conditionalLogic || field.conditionalLogic.length === 0) return true;
    
    return field.conditionalLogic.every(condition => {
      const fieldValue = values[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'not_contains':
          return !String(fieldValue).includes(String(condition.value));
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        case 'not_exists':
          return fieldValue === undefined || fieldValue === null || fieldValue === '';
        default:
          return true;
      }
    });
  }, [field.conditionalLogic, values]);

  if (!isVisible) return null;

  // Render appropriate field type
  switch (field.type) {
    case 'date':
      return (
        <DateField
          field={field}
          value={value}
          error={error}
          touched={touched}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
      
    case 'file':
      return (
        <FileUploadField
          field={field}
          value={value}
          error={error}
          touched={touched}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
      
    case 'tags':
      return (
        <TagInputField
          field={field}
          value={value}
          error={error}
          touched={touched}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
      
    case 'richtext':
      return (
        <RichTextField
          field={field}
          value={value}
          error={error}
          touched={touched}
          isValidating={isValidating}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
      
    default:
      // Use new template-driven system for basic field types
      return (
        <TemplateRenderer
          field={field}
          value={value}
          error={error}
          touched={touched}
          isValidating={isValidating}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
  }
};

// ========================
// FORM CONTENT COMPONENT
// ========================

const FormContent: React.FC<{
  fields: FieldConfig[];
  template?: any;
  onFieldChange?: (name: string, value: any, allValues: Record<string, any>) => void;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
  renderSubmitButton?: any;
}> = ({ fields, template, onFieldChange, onValidationChange, renderSubmitButton }) => {
  const {
    values,
    errors,
    touched,
    asyncValidating,
    setValue,
    setTouched,
    submit
  } = useFormContext();
  
  const { isSubmitting, isDirty, isValid } = useFormStatus();

  // Call validation callback when validation state changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid, errors);
    }
  }, [isValid, errors, onValidationChange]);

  // Handle field change with callback
  const handleFieldChange = useCallback((name: string, value: any) => {
    setValue(name, value);
    if (onFieldChange) {
      onFieldChange(name, value, { ...values, [name]: value });
    }
  }, [setValue, onFieldChange, values]);

  // Handle field blur
  const handleFieldBlur = useCallback((name: string) => {
    setTouched(name);
  }, [setTouched]);

  // Calculate form progress
  const progress = useMemo(() => {
    const totalFields = fields.length;
    const completedFields = fields.filter(field => {
      const value = values[field.name];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }, [fields, values]);

  // Get layout classes
  const getLayoutClasses = () => {
    if (!template?.styling?.layout) return '';
    
    switch (template.styling.layout) {
      case 'horizontal':
        return 'row';
      case 'grid':
        return `row row-cols-1 row-cols-md-${template.styling.columns || 2}`;
      default:
        return '';
    }
  };

  // Get field wrapper classes
  const getFieldWrapperClasses = (field: FieldConfig) => {
    if (template?.styling?.layout === 'grid') {
      return 'col mb-3';
    }
    if (template?.styling?.layout === 'horizontal') {
      return 'col-md-6 mb-3';
    }
    return '';
  };

  return (
    <Form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      {/* Progress indicator */}
      {template?.behavior?.showProgress && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">Form Progress</span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>
          <ProgressBar now={progress} className="mb-2" />
        </div>
      )}

      {/* Fields */}
      <div className={getLayoutClasses()}>
        {fields.map((field) => (
          <div key={field.name} className={getFieldWrapperClasses(field)}>
            <SmartFieldRenderer
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              touched={touched[field.name]}
              isValidating={asyncValidating[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              onBlur={() => handleFieldBlur(field.name)}
            />
          </div>
        ))}
      </div>

      {/* Submit button */}
      {renderSubmitButton ? (
        renderSubmitButton({
          isValid,
          isSubmitting,
          isDirty,
          values,
          submit
        })
      ) : (
        <div className="d-grid gap-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      )}
    </Form>
  );
};

// ========================
// MAIN SMART FORM COMPONENT
// ========================

const SmartForm: React.FC<SmartFormProps> = ({
  config,
  template,
  className = '',
  onFieldChange,
  onValidationChange,
  renderSubmitButton
}) => {
  // Apply template styling
  const formClassName = useMemo(() => {
    let classes = className;
    
    if (template?.styling?.theme) {
      switch (template.styling.theme) {
        case 'card':
          classes += ' ';
          break;
        case 'minimal':
          classes += ' border-0';
          break;
        default:
          break;
      }
    }
    
    return classes.trim();
  }, [className, template?.styling?.theme]);

  const formContent = (
    <FormProvider config={config}>
      <FormContent
        fields={config.fields}
        template={template}
        onFieldChange={onFieldChange}
        onValidationChange={onValidationChange}
        renderSubmitButton={renderSubmitButton}
      />
    </FormProvider>
  );

  // Wrap in card if specified
  if (template?.styling?.theme === 'card') {
    return (
      <Card className={formClassName}>
        <Card.Header>
          <h5 className="mb-0">{template.name}</h5>
          {template.description && (
            <small className="text-muted">{template.description}</small>
          )}
        </Card.Header>
        <Card.Body>
          {formContent}
        </Card.Body>
      </Card>
    );
  }

  return <div className={formClassName}>{formContent}</div>;
};

export default SmartForm;

// ========================
// CONVENIENCE HOOKS FOR EXTERNAL USE
// ========================

export const useSmartForm = (config: any) => {
  return {
    FormProvider,
    useFormContext,
    useFormStatus
  };
};

// ========================
// FORM VALIDATION HELPERS
// ========================

export const createValidationRule = (
  test: (value: any, formValues?: Record<string, any>) => boolean,
  message: string | ((value: any, formValues?: Record<string, any>) => string)
) => ({ test, message });

export const createAsyncValidationRule = (
  test: (value: any, formValues?: Record<string, any>) => Promise<boolean>,
  message: string | ((value: any, formValues?: Record<string, any>) => string),
  debounceMs: number = 300
) => ({ test, message, debounceMs });

// ========================
// COMMON VALIDATION RULES
// ========================

export const validationRules = {
  required: (fieldName: string = 'This field') => 
    createValidationRule(
      (value) => value !== undefined && value !== null && value !== '',
      `${fieldName} is required`
    ),
    
  email: () =>
    createValidationRule(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Please enter a valid email address'
    ),
    
  minLength: (min: number) =>
    createValidationRule(
      (value) => !value || value.length >= min,
      `Must be at least ${min} characters long`
    ),
    
  maxLength: (max: number) =>
    createValidationRule(
      (value) => !value || value.length <= max,
      `Must be no more than ${max} characters long`
    ),
    
  pattern: (regex: RegExp, message: string) =>
    createValidationRule(
      (value) => !value || regex.test(value),
      message
    ),
    
  numeric: () =>
    createValidationRule(
      (value) => !value || /^\d+$/.test(value),
      'Must be a valid number'
    ),
    
  url: () =>
    createValidationRule(
      (value) => !value || /^https?:\/\/.+/.test(value),
      'Must be a valid URL'
    )
};
