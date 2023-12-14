import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Fonction pour récupérer une valeur du localStorage avec gestion d'une valeur par défaut
  const getStoredValue = () => {
    const storedValue = localStorage.getItem(key);
    try {
      // Essayez de parser la valeur comme JSON, sinon, retournez la valeur brute
      return JSON.parse(storedValue) || storedValue;
    } catch (error) {
      console.error('Error parsing stored value:', error);
      return storedValue;
    }
  };

  const [value, setValue] = useState(getStoredValue);

  // Met à jour la valeur dans le localStorage et dans le state local
  const updateValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  useEffect(() => {
    // Met à jour la valeur si le localStorage change à l'extérieur du composant
    const handleStorageChange = () => {
      setValue(getStoredValue);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [value, updateValue];
};

