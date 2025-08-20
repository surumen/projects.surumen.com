// app/types/project/index.ts
// Project and form-related types

import { ReactNode } from 'react';

// ========================
// PROJECT TYPES
// ========================

export interface Project {
    slug: string;                    // Primary identifier
    title: string;                   // Project title
    shortDescription: string;        // For dashboard/list view
    description: string;             // For detailed project header
    technologies: string[];          // Unified tech stack
    year: number;                    // Project completion year
    category: string;                // Project category
    demo?: string;                   // Optional demo URL or component name
    blog?: string;                   // Optional blog slug
}

// ========================
// FORM TYPES
// ========================

export type Option = { value: string | number; label: string };
export type FieldType = 'input' | 'select' | 'switch';

export interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    inputType?: React.HTMLInputTypeAttribute;     // only for type="input"
    options?: Option[];                           // only for type="select"
    required?: boolean;
    readOnly?: boolean;
    validate?: (val: any) => boolean;             // return false = invalid
    initialValue?: any;
    /** Optional class for the Form.Group wrapper */
    groupClassName?: string;
    /** Optional class for the input/select control */
    controlClassName?: string;
}

export interface DynamicFormProps {
    fields: FieldConfig[];
    onSubmit: (values: Record<string, any>) => void;
    /** can be text, icon, JSX; `null` to hide submit button */
    submitLabel?: ReactNode | null;
    /** called on every field change with current values */
    onFieldChange?: (values: Record<string, any>) => void;
    /** Optional className for the <Form> element */
    formClassName?: string;
}
