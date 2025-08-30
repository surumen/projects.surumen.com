import React, { createContext, useContext } from 'react';
import { FormProps, FormContextValue } from '../types/form';
import { useForm } from '../../../hooks/forms/useForm';

// Form Context
const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
};

/**
 * Form component - Main form wrapper that provides form state context
 * 
 * Generates HTML structure:
 * <form>
 *   {children}
 * </form>
 */
export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = '',
  initialValues = {},
  noValidate = true
}) => {
  // Use form hook for state management
  const formState = useForm({
    initialValues,
    onSubmit
  });

  // Create context value
  const contextValue: FormContextValue = {
    ...formState,
    // Ensure all required methods are available
    registerFieldValidation: formState.registerFieldValidation,
    unregisterFieldValidation: formState.unregisterFieldValidation,
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formState.submit();
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form 
        onSubmit={handleSubmit}
        className={className}
        noValidate={noValidate}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
