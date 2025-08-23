// app/hooks/useFormCoordinator.ts
import { useState, useCallback, useMemo } from 'react';

interface SectionValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  fieldCount: number;
  validFieldCount: number;
}

interface FormCoordinatorState {
  values: Record<string, any>;
  sectionValidation: Record<string, SectionValidationState>;
  lastUpdated: Date | null;
}

export interface FormCoordinatorConfig {
  initialValues?: Record<string, any>;
  requiredFields?: string[];
  validationRules?: Array<{
    field: string;
    validator: (value: any, allValues: Record<string, any>) => boolean;
    message: string;
  }>;
  onValueChange?: (name: string, value: any, allValues: Record<string, any>) => void;
}

export interface FormCoordinator extends FormCoordinatorState {
  // Computed states
  isValid: boolean;
  canSubmit: boolean;
  progress: number;
  completedSections: string[];
  sectionsWithErrors: string[];
  totalErrors: number;
  totalFields: number;
  completedFields: number;
  
  // Actions
  handleFieldChange: (name: string, value: any, allSectionValues: Record<string, any>) => void;
  handleSectionValidation: (sectionId: string, isValid: boolean, errors: Record<string, string>) => void;
  registerSection: (sectionId: string, fieldCount: number) => void;
  unregisterSection: (sectionId: string) => void;
  resetForm: (newValues?: Record<string, any>) => void;
  updateValues: (values: Record<string, any>) => void;
  
  // Getters
  getFieldError: (fieldName: string) => string | undefined;
  getSectionStatus: (sectionId: string) => 'valid' | 'invalid' | 'pending' | 'unknown';
  getSectionValidation: (sectionId: string) => SectionValidationState | undefined;
  hasErrors: () => boolean;
}

export const useFormCoordinator = (config: FormCoordinatorConfig = {}): FormCoordinator => {
  const {
    initialValues = {},
    requiredFields = [],
    validationRules = [],
    onValueChange
  } = config;

  const [state, setState] = useState<FormCoordinatorState>({
    values: { ...initialValues },
    sectionValidation: {},
    lastUpdated: null
  });

  // Register a form section
  const registerSection = useCallback((sectionId: string, fieldCount: number) => {
    setState(prev => ({
      ...prev,
      sectionValidation: {
        ...prev.sectionValidation,
        [sectionId]: {
          isValid: false,
          errors: {},
          fieldCount,
          validFieldCount: 0
        }
      }
    }));
  }, []);

  // Unregister a form section
  const unregisterSection = useCallback((sectionId: string) => {
    setState(prev => {
      const { [sectionId]: removed, ...remainingSections } = prev.sectionValidation;
      return {
        ...prev,
        sectionValidation: remainingSections
      };
    });
  }, []);

  // Handle field changes from any section
  const handleFieldChange = useCallback((
    name: string, 
    value: any, 
    allSectionValues: Record<string, any>
  ) => {
    setState(prev => {
      const newValues = { ...prev.values, [name]: value };
      
      // Call custom value change handler if provided
      if (onValueChange) {
        onValueChange(name, value, newValues);
      }
      
      return {
        ...prev,
        values: newValues,
        lastUpdated: new Date()
      };
    });
  }, [onValueChange]);

  // Handle validation updates from individual sections
  const handleSectionValidation = useCallback((
    sectionId: string, 
    isValid: boolean, 
    errors: Record<string, string>
  ) => {
    setState(prev => {
      const currentSection = prev.sectionValidation[sectionId];
      if (!currentSection) {
        console.warn(`Section ${sectionId} not registered`);
        return prev;
      }

      // Count valid fields in this section
      const errorFields = Object.keys(errors).filter(key => errors[key]);
      const validFieldCount = currentSection.fieldCount - errorFields.length;
      
      return {
        ...prev,
        sectionValidation: {
          ...prev.sectionValidation,
          [sectionId]: {
            ...currentSection,
            isValid,
            errors,
            validFieldCount
          }
        }
      };
    });
  }, []);

  // Update form values programmatically
  const updateValues = useCallback((values: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, ...values },
      lastUpdated: new Date()
    }));
  }, []);

  // Reset all form data
  const resetForm = useCallback((newValues?: Record<string, any>) => {
    setState({
      values: newValues || { ...initialValues },
      sectionValidation: {},
      lastUpdated: null
    });
  }, [initialValues]);

  // Get error for specific field
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    for (const sectionValidation of Object.values(state.sectionValidation)) {
      if (sectionValidation.errors[fieldName]) {
        return sectionValidation.errors[fieldName];
      }
    }
    return undefined;
  }, [state.sectionValidation]);

  // Get status for specific section
  const getSectionStatus = useCallback((sectionId: string): 'valid' | 'invalid' | 'pending' | 'unknown' => {
    const section = state.sectionValidation[sectionId];
    if (!section) return 'unknown';
    if (section.validFieldCount === 0) return 'pending';
    return section.isValid ? 'valid' : 'invalid';
  }, [state.sectionValidation]);

  // Get section validation details
  const getSectionValidation = useCallback((sectionId: string): SectionValidationState | undefined => {
    return state.sectionValidation[sectionId];
  }, [state.sectionValidation]);

  // Check if form has any errors
  const hasErrors = useCallback((): boolean => {
    return Object.values(state.sectionValidation).some(section => !section.isValid);
  }, [state.sectionValidation]);

  // Computed values
  const computed = useMemo(() => {
    const sections = Object.values(state.sectionValidation);
    const sectionIds = Object.keys(state.sectionValidation);
    
    // Overall validation
    const isValid = sections.length > 0 && sections.every(section => section.isValid);
    
    // Required field validation
    const hasRequiredFields = requiredFields.every(field => {
      const value = state.values[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && String(value).trim().length > 0;
    });

    // Custom validation rules
    const customValidationPassed = validationRules.every(rule => {
      const value = state.values[rule.field];
      return rule.validator(value, state.values);
    });
    
    const canSubmit = isValid && hasRequiredFields && customValidationPassed;
    
    // Progress calculation
    const totalFields = sections.reduce((sum, section) => sum + section.fieldCount, 0);
    const completedFields = sections.reduce((sum, section) => sum + section.validFieldCount, 0);
    const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    
    // Section status
    const completedSections = sectionIds.filter(id => state.sectionValidation[id].isValid);
    const sectionsWithErrors = sectionIds.filter(id => !state.sectionValidation[id].isValid);
    
    // Error count
    const totalErrors = sections.reduce((sum, section) => 
      sum + Object.keys(section.errors).filter(key => section.errors[key]).length, 0
    );

    return {
      isValid,
      canSubmit,
      progress,
      completedSections,
      sectionsWithErrors,
      totalErrors,
      totalFields,
      completedFields
    };
  }, [state.sectionValidation, state.values, requiredFields, validationRules]);

  return {
    ...state,
    ...computed,
    handleFieldChange,
    handleSectionValidation,
    registerSection,
    unregisterSection,
    resetForm,
    updateValues,
    getFieldError,
    getSectionStatus,
    getSectionValidation,
    hasErrors
  };
};
