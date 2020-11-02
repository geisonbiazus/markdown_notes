import React from 'react';
import { AuthenticatedApp } from './AuthenticatedApp';
import { useSesionContext } from './SessionContext';
import { UnauthenticatedApp } from './UnauthenticatedApp';

export const App: React.FC = () => {
  const { authenticated } = useSesionContext();

  return authenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
