import React, { useContext } from 'react';

export interface SessionContextValue {
  authenticated: boolean;
  token: string;
}

function newSessionContextValue(): SessionContextValue {
  return { authenticated: false, token: '' };
}

const SessionContext = React.createContext<SessionContextValue>(newSessionContextValue());

export const SessionProvider: React.FC = ({ children }) => {
  const value = newSessionContextValue();

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSesionContext = () => useContext(SessionContext);
