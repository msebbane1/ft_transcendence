import useLocalStorage from "./useLocalStorage";

const useUserStorage = (name, defaults = {}) => {
  
  const [storage, setStorage] = useLocalStorage(name, defaults);

  const set = (key, value) => {
    setStorage({ ...storage, [key]: value });
  };
const setAll = (attributes) => {
    let local = { ...storage };
    Object.keys(attributes).forEach((key) => {
      
      //local[key] = typeof attributes[key] === 'boolean' ? String(attributes[key]) : attributes[key];
      local[key] = attributes[key];
    });
    setStorage(local);
    /*
    const test = local.avatar_update;
    if(test == true)
      localStorage.setItem("image", "true");
    else
      localStorage.setItem("image", "false");
    console.log("After setAll:", local);*/
  };
 /* const setAll = (attributes) => {
    let local = { ...storage };
    Object.keys(attributes).forEach((key) => (local[key] = attributes[key]));
    setStorage(local);
    console.log("After setAll:", local);
  };*/

  const has = (key) => {
    return Object.keys(storage).indexOf(key) > -1;
  };

  
  const get = (key) => {
    return storage[key] !== undefined ? storage[key] : null;
  };

  
  const clear = () => {
    setStorage({});
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

