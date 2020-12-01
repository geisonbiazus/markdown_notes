import React, { useContext, useMemo, useState } from 'react';
import { useAppContext } from '../app';
import { HTTPClient, StateManager } from '../utils';
import { APIAuthenticationClient } from './clients';
import { newSignInState, SignInInteractor, SignInState } from './interactors';
import { LocalStorageSessionRepository } from './repositories';

export interface AuthenticationContextValue {
  signInState: SignInState;
  signInInteractor: SignInInteractor;
}

const AuthenticationContext = React.createContext<AuthenticationContextValue>(null!);

function useSigninInteractor(): [SignInState, SignInInteractor] {
  const { config } = useAppContext();
  const [signInState, setSignInState] = useState(newSignInState());

  const signInInteractor = useMemo(() => {
    const stateManager = new StateManager<SignInState>(signInState, setSignInState);
    const httpClient = new HTTPClient(config.apiURL);
    const authenticationclient = new APIAuthenticationClient(httpClient);
    const sessionRepository = new LocalStorageSessionRepository();
    const signInInteractor = new SignInInteractor(
      stateManager,
      authenticationclient,
      sessionRepository
    );

    signInInteractor.checkAuthentication();

    return signInInteractor;
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
