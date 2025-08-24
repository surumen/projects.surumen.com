// app/widgets/forms/templates/TemplateRenderer.tsx
// Main template coordinator that selects and renders appropriate template

import React from 'react';
import type { FieldConfig } from '@/types/forms/advanced';
import { selectFieldTemplate, shouldUseInputGroup } from '../utils';
import BasicFieldTemplate from './BasicFieldTemplate';
import InputGroupTemplate from './InputGroupTemplate';
import SwitchTemplate from './SwitchTemplate';

interface TemplateRendererProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched: boolean;
  isValidating?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = (props) => {
  const { field } = props;
  
  // Determine which template to use
  if (field.type === 'switch') {
    return <SwitchTemplate {...props} />;
  }
  
  if (shouldUseInputGroup(field)) {
    return <InputGroupTemplate {...props} />;
  }
  
  // For basic input, textarea, select fields
  if (['input', 'textarea', 'select'].includes(field.type)) {
    return <BasicFieldTemplate {...props} />;
  }
  
  // Fallback for any unhandled field types
  console.warn(`TemplateRenderer: No template found for field type '${field.type}', falling back to BasicFieldTemplate`);
  return <BasicFieldTemplate {...props} />;
};

export default TemplateRenderer;
