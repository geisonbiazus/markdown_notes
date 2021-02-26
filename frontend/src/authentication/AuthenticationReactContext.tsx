import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app';
import {
  ActivateUserInteractor,
  ActivateUserState,
  SignInInteractor,
  SignInState,
} from './interactors';
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

function useActivateUserInteractor(): [ActivateUserState, ActivateUserInteractor] {
  const { authenticationContext } = useAppContext();
  const { activateUserInteractor } = authenticationContext;
  const [activateUserState, setActivateUserState] = useState(activateUserInteractor.state);

  useEffect(() => {
    const dispose = activateUserInteractor.observe(setActivateUserState);
    return dispose;
  }, [activateUserInteractor]);

  return [activateUserState, activateUserInteractor];
}

export const AuthenticationProvider: React.FC = ({ children }) => {
  const [signInState, signInInteractor] = useSigninInteractor();
  const [signUpState, signUpInteractor] = useSignUpInteractor();
  const [activateUserState, activateUserinteractor] = useActivateUserInteractor();

  const value = {
    signInState,
    signInInteractor,
    signUpState,
    signUpInteractor,
    activateUserState,
    activateUserinteractor,
  };

  return (
    <AuthenticationReactContext.Provider value={value}>
      {children}
    </AuthenticationReactContext.Provider>
  );
};

export const useAuthenticationContext = () => useContext(AuthenticationReactContext);
