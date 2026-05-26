import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isPageReady, setIsPageReady] = useState(false);

  const getInitialLoader = () => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'orbital';
    if (path === '/login' || path === '/signup' || path === '/verify') return 'quick';
    return 'page';
  };

  const initial = getInitialLoader();

  const [pageLoadConfig, setPageLoadConfig] = useState({ isActive: initial === 'page' });
  const [quickLoadConfig, setQuickLoadConfig] = useState({ isActive: initial === 'quick', onMidpoint: null, isInitial: initial === 'quick' });
  const [orbitalLoadConfig, setOrbitalLoadConfig] = useState({ isActive: initial === 'orbital', onMidpoint: null, isInitial: initial === 'orbital' });

  const triggerQuickTransition = (onMidpointCallback) => {
    setIsPageReady(false);
    setQuickLoadConfig({ isActive: true, onMidpoint: onMidpointCallback, isInitial: false });
  };

  const endQuickTransition = () => {
    setQuickLoadConfig({ isActive: false, onMidpoint: null, isInitial: false });
  };

  const triggerOrbitalTransition = (onMidpointCallback) => {
    setIsPageReady(false);
    setOrbitalLoadConfig({ isActive: true, onMidpoint: onMidpointCallback, isInitial: false });
  };

  const endOrbitalTransition = () => {
    setOrbitalLoadConfig({ isActive: false, onMidpoint: null, isInitial: false });
  };

  return (
    <LoadingContext.Provider value={{ 
      isPageReady, setIsPageReady, 
      pageLoadConfig, setPageLoadConfig,
      quickLoadConfig, triggerQuickTransition, endQuickTransition,
      orbitalLoadConfig, triggerOrbitalTransition, endOrbitalTransition
    }}>
      {children}
    </LoadingContext.Provider>
  );
};
