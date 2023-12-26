// ImageContext.js
import { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImageContext = () => {
  return useContext(ImageContext);
};

export const ImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  const setProfileImageURL = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  return (
    <ImageContext.Provider value={{ profileImage, setProfileImageURL }}>
      {children}
    </ImageContext.Provider>
  );
};

