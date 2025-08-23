import React, { useCallback, useEffect } from 'react';
import SmartForm from './core/SmartForm';
import type { FieldConfig, FormConfig } from '@/types/forms/advanced';
import type { FormCoordinator, FormSectionProps, FormSectionRenderProps } from '@/types/forms/coordinator';

const FormSection: React.FC<FormSectionProps> = ({
  sectionId,
  fields,
  values,
  coordinator,
  showValidationStatus = true,
  className = '',
  children
}) => {
  // Register this section when component mounts
  useEffect(() => {
    coordinator.registerSection(sectionId, fields.length);
    
    // Cleanup on unmount
    return () => {
      coordinator.unregisterSection(sectionId);
    };
  }, [sectionId, fields.length, coordinator]);

  // Create section-specific form config
  const sectionConfig: FormConfig = {
    fields,
    initialValues: values,
    onSubmit: () => {}, // Sections don't submit individually
    validation: {
      mode: 'onChange',
      revalidateMode: 'onChange'
    }
  };

  // Handle validation changes from this section
  const handleValidationChange = useCallback((isValid: boolean, errors: Record<string, string>) => {
    coordinator.handleSectionValidation(sectionId, isValid, errors);
  }, [sectionId, coordinator]);

  // Get section status and validation info
  const sectionStatus = coordinator.getSectionStatus(sectionId);
  const sectionValidation = coordinator.getSectionValidation(sectionId);

  // Create the form element
  const formElement = (
    <SmartForm
      config={sectionConfig}
      onFieldChange={coordinator.handleFieldChange}
      onValidationChange={handleValidationChange}
      renderSubmitButton={() => null} // No individual submit buttons
      className={className}
    />
  );

  // Prepare validation summary
  const validationSummary = {
    isValid: sectionValidation?.isValid ?? false,
    errorCount: sectionValidation ? Object.keys(sectionValidation.errors).filter(key => sectionValidation.errors[key]).length : 0,
    fieldCount: sectionValidation?.fieldCount ?? 0,
    validFieldCount: sectionValidation?.validFieldCount ?? 0
  };

  // If children render prop is provided, use it
  if (children) {
    const renderProps: FormSectionRenderProps = {
      sectionId,
      sectionStatus,
      sectionValidation,
      formElement,
      validationSummary
    };
    return <>{children(renderProps)}</>;
  }

  // Default render (just the form)
  return formElement;
};

export default FormSection;
