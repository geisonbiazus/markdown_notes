import React, { useContext, useEffect, useState } from 'react';
import { useAppContext } from '../app/AppReactContext';
import { ActivateUserStore, ActivateUserState } from './stores/ActivateUserStore';
import { SignInStore, SignInState } from './stores/SignInStore';
import { SignUpStore, SignUpState } from './stores/SignUpStore';

export interface AuthenticationContextValue {
  signInState: SignInState;
  signInStore: SignInStore;
  signUpState: SignUpState;
  signUpStore: SignUpStore;
  activateUserState: ActivateUserState;
  activateUserStore: ActivateUserStore;
}

const AuthenticationReactContext = React.createContext<AuthenticationContextValue>(null!);

function useSigninStore(): [SignInState, SignInStore] {
  const { authenticationContext } = useAppContext();
  const { signInStore } = authenticationContext;
  const [signInState, setSignInState] = useState(signInStore.state);

  useEffect(() => {
    const dispose = signInStore.observe(setSignInState);

    return dispose;
  }, [signInStore, setSignInState]);

  return [signInState, signInStore];
}

function useSignUpStore(): [SignUpState, SignUpStore] {
  const { authenticationContext } = useAppContext();
  const { signUpStore } = authenticationContext;
  const [signUpState, setSignUpState] = useState(signUpStore.state);

  useEffect(() => {
    const dispose = signUpStore.observe(setSignUpState);
    return dispose;
  }, [signUpStore, setSignUpState]);

  return [signUpState, signUpStore];
}

function useActivateUserStore(): [ActivateUserState, ActivateUserStore] {
  const { authenticationContext } = useAppContext();
  const { activateUserStore } = authenticationContext;
  const [activateUserState, setActivateUserState] = useState(activateUserStore.state);

  useEffect(() => {
    const dispose = activateUserStore.observe(setActivateUserState);
    return dispose;
  }, [activateUserStore]);

  return [activateUserState, activateUserStore];
}

export const AuthenticationProvider: React.FC = ({ children }) => {
  const [signInState, signInStore] = useSigninStore();
  const [signUpState, signUpStore] = useSignUpStore();
  const [activateUserState, activateUserStore] = useActivateUserStore();

  const value: AuthenticationContextValue = {
    signInState,
    signInStore,
    signUpState,
    signUpStore,
    activateUserState,
    activateUserStore,
  };

  return (
    <AuthenticationReactContext.Provider value={value}>
      {children}
    </AuthenticationReactContext.Provider>
  );
};

export const useAuthenticationContext = () => useContext(AuthenticationReactContext);
