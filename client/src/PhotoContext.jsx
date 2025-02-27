// PhotoContext.js
import { createContext, useState } from 'react';

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  return (
    <PhotoContext.Provider value={{ currentPhotoIndex, setCurrentPhotoIndex }}>
      {children}
    </PhotoContext.Provider>
  );
};
