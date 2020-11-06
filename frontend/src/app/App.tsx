import React from 'react';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useAuthenticationContext } from '../authentication';
import { UnauthenticatedApp } from './UnauthenticatedApp';

export const App: React.FC = () => {
  const { signInState } = useAuthenticationContext();

  return signInState.authenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
