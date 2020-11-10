import React, { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  CenteredContainer,
  FormErrorMessage,
  Form,
  FormRow,
  NarrowContainer,
  TextField,
} from '../../shared/components';
import { useAuthenticationContext } from '../AuthenticationContext';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { signInState, signInInteractor } = useAuthenticationContext();

  useEffect(() => {
    signInInteractor.checkAuthentication();
  }, []);

  const setEmail = (event: ChangeEvent<HTMLInputElement>) => {
    signInInteractor.setEmail(event.target.value);
  };

  const setPassword = (event: ChangeEvent<HTMLInputElement>) => {
    signInInteractor.setPassword(event.target.value);
  };

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await signInInteractor.signIn();
  };

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Please sign in')}</h3>
        <Form onSubmit={onSubmit}>
          <FormErrorMessage feature="sign_in" type={signInState.errors.base} />
          <FormRow>
            <TextField
              label={t('Email')}
              type="email"
              onChange={setEmail}
              errorField="email"
              errorType={signInState.errors.email}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Password')}
              type="password"
              onChange={setPassword}
              errorField="password"
              errorType={signInState.errors.password}
            />
          </FormRow>
          <Button variant="primary" type="submit">
            {t('Sign in')}
          </Button>
        </Form>
      </NarrowContainer>
    </CenteredContainer>
  );
};
