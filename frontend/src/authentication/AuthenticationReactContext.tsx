import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app';
import { SignInInteractor, SignInState } from './interactors';

export interface AuthenticationContextValue {
  signInState: SignInState;
  signInInteractor: SignInInteractor;
}

const AuthenticationReactContext = React.createContext<AuthenticationContextValue>(null!);

function useSigninInteractor(): [SignInState, SignInInteractor] {
  const { authenticationContext } = useAppContext();
  const { signInInteractor } = authenticationContext;
  const [signInState, setSignInState] = useState(signInInteractor.state);

  useEffect(() => {
    const dispose = signInInteractor.observe(setSignInState);

    signInInteractor.checkAuthentication();

    return dispose;
  }, [signInInteractor, setSignInState]);

  return [signInState, signInInteractor];
}

export const AuthenticationProvider: React.FC = ({ children }) => {
  const [signInState, signInInteractor] = useSigninInteractor();

  const value = { signInState, signInInteractor };

  return (
    <AuthenticationReactContext.Provider value={value}>
      {children}
    </AuthenticationReactContext.Provider>
  );
};

export const useAuthenticationContext = () => useContext(AuthenticationReactContext);
