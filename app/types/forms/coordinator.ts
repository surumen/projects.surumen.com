import type { ReactNode } from 'react';
import type { FieldConfig } from './advanced';

export interface SectionValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  fieldCount: number;
  validFieldCount: number;
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

export interface FormCoordinator {
  // State
  values: Record<string, any>;
  sectionValidation: Record<string, SectionValidationState>;
  lastUpdated: Date | null;
  
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

export interface FormSectionProps {
  sectionId: string;
  fields: FieldConfig[];
  values: Record<string, any>;
  coordinator: FormCoordinator;
  showValidationStatus?: boolean;
  className?: string;
  children?: (props: FormSectionRenderProps) => ReactNode;
}

export interface FormSectionRenderProps {
  sectionId: string;
  sectionStatus: 'valid' | 'invalid' | 'pending' | 'unknown';
  sectionValidation?: SectionValidationState;
  formElement: ReactNode;
  validationSummary: {
    isValid: boolean;
    errorCount: number;
    fieldCount: number;
    validFieldCount: number;
  };
}
