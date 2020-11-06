import React, { ChangeEvent, SyntheticEvent, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  CenteredContainer,
  Form,
  FormRow,
  NarrowContainer,
  TextField,
} from '../../shared/components';
import { useAuthenticationContext } from '../AuthenticationContext';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { signInState, signInInteractor } = useAuthenticationContext();

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
          {signInState.errors.base}
          <Button variant="primary" type="submit">
            {t('Sign in')}
          </Button>
        </Form>
      </NarrowContainer>
    </CenteredContainer>
  );
};
