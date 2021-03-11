import React from 'react';
import { useAuthenticationContext } from '../../authentication/AuthenticationReactContext';
import { AuthenticatedApp } from './AuthenticatedApp';
import { UnauthenticatedApp } from './UnauthenticatedApp';

export const App: React.FC = () => {
  const { signInState } = useAuthenticationContext();

  return signInState.authenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
