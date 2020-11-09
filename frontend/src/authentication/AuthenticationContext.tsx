import React, { useContext, useMemo, useState } from 'react';
import { StateManager } from '../utils';
import { InMemoryAuthenticationClient } from './clients';
import { newSignInState, SignInInteractor, SignInState } from './interactors';
import { InMemorySessionRepository } from './repositories';

export interface AuthenticationContextValue {
  signInState: SignInState;
  signInInteractor: SignInInteractor;
}

const AuthenticationContext = React.createContext<AuthenticationContextValue>(null!);

function useSigninInteractor(): [SignInState, SignInInteractor] {
  const [signInState, setSignInState] = useState(newSignInState());

  const signInInteractor = useMemo(() => {
    const stateManager = new StateManager<SignInState>(signInState, setSignInState);
    const authenticationclient = new InMemoryAuthenticationClient();
    authenticationclient.addUser('user@example.com', 'password123', 'token');

    const sessionRepository = new InMemorySessionRepository();
    return new SignInInteractor(stateManager, authenticationclient, sessionRepository);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [signInState, signInInteractor];
}

export const AuthenticationProvider: React.FC = ({ children }) => {
  const [signInState, signInInteractor] = useSigninInteractor();

  const value = { signInState, signInInteractor };

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};

export const useAuthenticationContext = () => useContext(AuthenticationContext);
