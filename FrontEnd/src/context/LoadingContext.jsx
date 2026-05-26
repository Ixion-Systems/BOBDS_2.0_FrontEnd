import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isPageReady, setIsPageReady] = useState(false);

  return (
    <LoadingContext.Provider value={{ isPageReady, setIsPageReady }}>
      {children}
    </LoadingContext.Provider>
  );
};
