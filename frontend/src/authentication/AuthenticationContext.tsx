import React, { useContext } from 'react';

export interface AuthenticationContextValue {
  authenticated: boolean;
  token: string;
}

function newAuthenticationContextValue(): AuthenticationContextValue {
  return { authenticated: false, token: '' };
}

const AuthenticationContext = React.createContext<AuthenticationContextValue>(
  newAuthenticationContextValue()
);

export const AuthenticationProvider: React.FC = ({ children }) => {
  const value = newAuthenticationContextValue();

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};

export const useAuthenticationContext = () => useContext(AuthenticationContext);
