/**
 * Debounce function for async operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Create a debounced promise function
 */
export const debounceAsync = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeoutId: NodeJS.Timeout;
  let resolvePromise: ((value: any) => void) | null = null;
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      resolvePromise = resolve;
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          if (resolvePromise === resolve) {
            resolve(result);
          }
        } catch (error) {
          if (resolvePromise === resolve) {
            resolve(Promise.reject(error));
          }
        }
      }, delay);
    });
  };
};

/**
 * Check if a value has changed meaningfully
 */
export const hasValueChanged = (oldValue: any, newValue: any): boolean => {
  // Handle null/undefined
  if (oldValue === newValue) return false;
  if (oldValue == null && newValue == null) return false;
  if (oldValue == null || newValue == null) return true;
  
  // Handle arrays
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length !== newValue.length) return true;
    return oldValue.some((item, index) => hasValueChanged(item, newValue[index]));
  }
  
  // Handle objects
  if (typeof oldValue === 'object' && typeof newValue === 'object') {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }
  
  // Handle primitive values
  return oldValue !== newValue;
};
