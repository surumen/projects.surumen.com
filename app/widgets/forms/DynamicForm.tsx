import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import type { FieldConfig, DynamicFormProps } from '@/types';

const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    onSubmit,
    submitLabel = 'Submit',
    onFieldChange,
    formClassName,
}) => {
    const initialState = fields.reduce((acc, f) => {
        acc[f.name] = f.initialValue ?? (f.type === 'switch' ? false : '');
        return acc;
    }, {} as Record<string, any>);

    const [values, setValues] = useState<Record<string, any>>(initialState);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (name: string, val: any) => {
        const newValues = { ...values, [name]: val };
        setValues(newValues);
        setTouched(t => ({ ...t, [name]: true }));
        if (onFieldChange) onFieldChange(newValues);
    };

    const isValid = (f: FieldConfig) => {
        const val = values[f.name];
        if (f.required && (val === '' || val == null)) return false;
        if (f.validate && !f.validate(val)) return false;
        return true;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const allGood = fields.every(isValid);
        if (!allGood) return;
        onSubmit(values);
    };

    return (
        <Form onSubmit={handleSubmit} className={formClassName}>
            {fields.map(f => {
                const val = values[f.name];
                const invalid = touched[f.name] && !isValid(f);
                const groupClass = `mb-3 ${f.groupClassName || ''}`.trim();
                const autoControl = f.groupClassName?.includes('d-flex') && !f.controlClassName;
                const controlClass = f.controlClassName || (autoControl ? 'flex-fill' : '');

                switch (f.type) {
                    case 'input':
                        return (
                            <Form.Group className={groupClass} key={f.name} controlId={f.name}>
                                <Form.Label className={autoControl ? 'me-2 mb-0' : undefined}>
                                    {f.label}{' '}
                                    {!f.required && <span className='text-muted'>(Optional)</span>}
                                </Form.Label>
                                <Form.Control
                                    className={controlClass}
                                    type={f.inputType || 'text'}
                                    value={val}
                                    readOnly={f.readOnly}
                                    onChange={e => handleChange(f.name, e.target.value)}
                                    isInvalid={invalid}
                                    required={f.required}
                                />
                                {invalid && (
                                    <Form.Control.Feedback type="invalid">
                                        {f.label} is invalid.
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        );

                    case 'select':
                        return (
                            <Form.Group className={groupClass} key={f.name} controlId={f.name}>
                                <Form.Label className={autoControl ? 'me-2 mb-0' : undefined}>
                                    {f.label}
                                </Form.Label>
                                <Form.Select
                                    className={controlClass}
                                    value={val}
                                    onChange={e => handleChange(f.name, e.target.value)}
                                    disabled={f.readOnly}
                                    isInvalid={invalid}
                                    required={f.required}
                                >
                                    <option value="" disabled>— select —</option>
                                    {f.options?.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                {invalid && (
                                    <Form.Control.Feedback type="invalid">
                                        Please select {f.label.toLowerCase()}.
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        );

                    case 'switch':
                        return (
                            <Form.Group className={groupClass} key={f.name} controlId={f.name}>
                                <Form.Check
                                    type="switch"
                                    label={f.label}
                                    checked={!!val}
                                    onChange={e => handleChange(f.name, e.target.checked)}
                                />
                            </Form.Group>
                        );

                    default:
                        return null;
                }
            })}

            {submitLabel != null && (
                <div className="d-grid">
                    <Button type="submit" disabled={fields.some(f => !isValid(f))}>
                        {submitLabel}
                    </Button>
                </div>
            )}
        </Form>
    );
};

export default DynamicForm;
