import useLocalStorage from "./useLocalStorage";

const useUserStorage = (name, defaults = {}) => {
  
  const [storage, setStorage] = useLocalStorage(name, defaults);

  const set = (key, value) => {
    setStorage({ ...storage, [key]: value });
  };

  const setAll = (attributes) => {
    let local = { ...storage };
    Object.keys(attributes).forEach((key) => (local[key] = attributes[key]));
    setStorage(local);
  };

  // Fonction pour vérifier si une propriété existe pour l'utilisateur
  const has = (key) => {
    return Object.keys(storage).indexOf(key) > -1;
  };

  // Fonction pour obtenir la valeur d'une propriété de l'utilisateur
  const get = (key) => {
    return storage[key] || null;
  };

  // Fonction pour effacer toutes les propriétés de l'utilisateur
  const clear = () => {
    setStorage({});
  };

  // Retourne un objet avec toutes les fonctions et les données actuelles de l'utilisateur
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

