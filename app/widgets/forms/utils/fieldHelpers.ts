/**
 * Generate unique field ID based on field name
 */
export const generateFieldId = (name: string): string => {
  return `field_${name}`;
};

/**
 * Check if a value is considered empty
 */
export const isEmpty = (value: any): boolean => {
  return value === undefined || value === null || value === '';
};

/**
 * Check if a field is required and empty
 */
export const isRequiredFieldEmpty = (value: any, required: boolean): boolean => {
  return required && isEmpty(value);
};

/**
 * Parse field value based on field type
 */
export const parseFieldValue = (value: string, type: string): any => {
  if (isEmpty(value)) return value;
  
  switch (type) {
    case 'number':
    case 'range':
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    default:
      return value;
  }
};

/**
 * Get default value for field type
 */
export const getDefaultFieldValue = (type: string): any => {
  switch (type) {
    case 'number':
    case 'range':
      return '';
    case 'textarea':
      return '';
    default:
      return '';
  }
};

/**
 * Check if field type should use textarea element
 */
export const shouldUseTextarea = (type: string): boolean => {
  return type === 'textarea';
};

/**
 * Get HTML input type for field
 */
export const getHtmlInputType = (type: string): string => {
  // Map field types to HTML input types
  switch (type) {
    case 'textarea':
      return 'text'; // Not used for textarea, but fallback
    default:
      return type;
  }
};
