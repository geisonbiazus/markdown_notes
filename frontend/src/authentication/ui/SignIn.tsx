import React from 'react';
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
import { useAuthenticationContext } from '../AuthenticationReactContext';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { signInState, signInInteractor } = useAuthenticationContext();

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Please sign in')}</h3>
        <Form onSubmit={signInInteractor.signIn}>
          <FormErrorMessage feature="sign_in" type={signInState.errors.base} />
          <FormRow>
            <TextField
              label={t('Email')}
              type="email"
              onChange={signInInteractor.setEmail}
              errorField="email"
              errorType={signInState.errors.email}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Password')}
              type="password"
              onChange={signInInteractor.setPassword}
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
