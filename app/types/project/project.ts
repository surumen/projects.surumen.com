// app/types/project/index.ts
// Project and form-related types

import { ReactNode } from 'react';

// ========================
// PROJECT TYPES
// ========================

export interface Project {
    id: string;
    languages: string[];
    frameworks: string[];
    technologyAreas: string[];
    title: string;
    shortTitle?: string;
    slug?: string;
    shortDescription: string;
    description: string;
    content: string;
    hasDemo: boolean;
    hasBlog: boolean;

    completed?: string;
    status?: string;
    level?: string;
    image?: string;
    duration?: string;
    rating?: any;
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
