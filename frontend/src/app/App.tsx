import React from 'react';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useAuthenticationContext } from '../authentication';
import { UnauthenticatedApp } from './UnauthenticatedApp';

export const App: React.FC = () => {
  const { authenticated } = useAuthenticationContext();

  return authenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
