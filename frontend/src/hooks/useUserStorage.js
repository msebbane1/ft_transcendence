import { useState, useEffect } from "react";

const useUserStorage = (name, defaults = {}) => {
  const base64Encode = (str) => {
    return btoa(str);
  };

  const base64Decode = (str) => {
    return atob(str);
  };

  const getLocalStorageData = () => {
    const localStorageData = localStorage.getItem(name);
    if (localStorageData) {
      return JSON.parse(base64Decode(localStorageData)); // Tente de décoder la chaîne JSON
    }
    return defaults; // Retourne les valeurs par défaut si aucune donnée n'est trouvée dans le stockage local
  };

  const [storage, setStorage] = useState(getLocalStorageData());

  useEffect(() => {
    // Effect hook pour mettre à jour le stockage local lorsque le state change
    localStorage.setItem(name, base64Encode(JSON.stringify(storage)));
  }, [name, storage]);

  const set = (key, value) => {
    const updatedStorage = { ...storage, [key]: value };
    setStorage(updatedStorage);
  };

  const setAll = (attributes) => {
    setStorage(attributes);
  };

  const has = (key) => {
    return Object.keys(storage).includes(key);
  };

  const get = (key) => {
    return storage[key] !== undefined ? storage[key] : null;
  };

  const clear = () => {
    localStorage.removeItem(name);
    setStorage(defaults); // Réinitialise le state avec les valeurs par défaut après avoir supprimé les données du stockage local
  };

  return {
    attributes: storage,
    set,
    setAll,
    has,
    get,
    clear,
  };
};

export default useUserStorage;



  