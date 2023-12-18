import useLocalStorage from "./useLocalStorage2";

const useSession = (name, defaults = {}) => {
  const [storage, setStorage] = useLocalStorage(name, defaults);

  const setEntry = (key, value) => {
    setStorage({ ...storage, [key]: value });
  };

  const setAllEntries = (entries) => {
    let local = { ...storage };
    Object.keys(entries).forEach((key) => (local[key] = entries[key]));
    setStorage(local);
  };

  const hasEntry = (key) => {
    return Object.keys(storage).indexOf(key) > -1;
  };

  const getEntry = (key) => {
    return storage[key] || null;
  };

  const clear = () => {
    setStorage({});
  };

  const logout = () => {
    setStorage({}); // Efface toutes les données de la session
  };

  return {
    value: storage,
    set: setEntry,
    setAll: setAllEntries,
    has: hasEntry,
    get: getEntry,
    clear: clear,
    logout: logout, // Ajoutez la fonction de déconnexion
  };
};

export default useSession;

