import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const AppReactContext = React.createContext<AppContext>(null!);

export interface AppProviderProps {
  appContext: AppContext;
}

export const AppProvider: React.FC<AppProviderProps> = ({ appContext, children }) => {
  return <AppReactContext.Provider value={appContext}>{children}</AppReactContext.Provider>;
};

export const useAppContext = () => useContext(AppReactContext);
