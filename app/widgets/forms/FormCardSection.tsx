import React from 'react';
import { Card } from 'react-bootstrap';
import FormSection from './FormSection';
import type { FormCoordinator } from '@/types/forms/coordinator';
import type { FieldConfig } from '@/types/forms/advanced';

interface FormCardSectionProps {
  sectionId: string;
  title: string;
  fields: FieldConfig[];
  coordinator: FormCoordinator;
  children?: React.ReactNode;
}

const FormCardSection: React.FC<FormCardSectionProps> = ({
  sectionId,
  title,
  fields,
  coordinator,
  children
}) => {
  return (
    <div className="card card-lg mb-3 mb-lg-5">
      <div className="card-header">
        <h4 className="card-header-title">{title}</h4>
      </div>
      <div className="card-body">
        {children && (
          <div className="mb-3">
            {children}
          </div>
        )}
        <FormSection
          sectionId={sectionId}
          fields={fields}
          values={coordinator.values}
          coordinator={coordinator}
        />
      </div>
    </div>
  );
};

export default FormCardSection;
