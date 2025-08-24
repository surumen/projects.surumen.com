/**
 * Combine CSS class names, filtering out falsy values
 */
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get base form control classes
 */
export const getFormControlClasses = (
  type: string, 
  customClasses?: string, 
  hasError?: boolean
): string => {
  const baseClass = type === 'select' ? 'form-select' : 'form-control';
  
  return classNames(
    baseClass,
    customClasses,
    hasError && 'is-invalid'
  );
};

/**
 * Get field wrapper classes
 */
export const getFieldWrapperClasses = (customClasses?: string): string => {
  return classNames('mb-3', customClasses);
};

/**
 * Get column classes for FieldGroup
 */
export const getColumnClasses = (columns?: number): string => {
  if (!columns) return '';
  return `col-${columns}`;
};
