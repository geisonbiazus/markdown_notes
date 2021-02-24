import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app';
import { SignInInteractor, SignInState } from './interactors';
import { SignUpInteractor, SignUpState } from './interactors/SignUpInteractor';

export interface AuthenticationContextValue {
  signInState: SignInState;
  signInInteractor: SignInInteractor;
  signUpState: SignUpState;
  signUpInteractor: SignUpInteractor;
}

const AuthenticationReactContext = React.createContext<AuthenticationContextValue>(null!);

function useSigninInteractor(): [SignInState, SignInInteractor] {
  const { authenticationContext } = useAppContext();
  const { signInInteractor } = authenticationContext;
  const [signInState, setSignInState] = useState(signInInteractor.state);

  useEffect(() => {
    const dispose = signInInteractor.observe(setSignInState);

    return dispose;
  }, [signInInteractor, setSignInState]);

  return [signInState, signInInteractor];
}

function useSignUpInteractor(): [SignUpState, SignUpInteractor] {
  const { authenticationContext } = useAppContext();
  const { signUpInteractor } = authenticationContext;
  const [signUpState, setSignUpState] = useState(signUpInteractor.state);

  useEffect(() => {
    const dispose = signUpInteractor.observe(setSignUpState);
    return dispose;
  }, [signUpInteractor, setSignUpState]);

  return [signUpState, signUpInteractor];
}

export const AuthenticationProvider: React.FC = ({ children }) => {
  const [signInState, signInInteractor] = useSigninInteractor();
  const [signUpState, signUpInteractor] = useSignUpInteractor();

  const value = { signInState, signInInteractor, signUpState, signUpInteractor };

  return (
    <AuthenticationReactContext.Provider value={value}>
      {children}
    </AuthenticationReactContext.Provider>
  );
};

export const useAuthenticationContext = () => useContext(AuthenticationReactContext);
