import { useEffect } from 'react';

// Custom hook for managing body classes
const useBodyClasses = (classes: string[]) => {
  useEffect(() => {
    const activeClasses = classes.filter(Boolean);
    const currentClasses = document.body.className.split(' ').filter(Boolean);
    
    // Add new classes
    const allClasses = [...new Set([...currentClasses, ...activeClasses])];
    document.body.className = allClasses.join(' ');
    
    // Cleanup function to remove classes when component unmounts
    return () => {
      const remainingClasses = document.body.className
        .split(' ')
        .filter(cls => !activeClasses.includes(cls))
        .filter(Boolean);
      document.body.className = remainingClasses.join(' ');
    };
  }, [classes]);
};

export default useBodyClasses;
