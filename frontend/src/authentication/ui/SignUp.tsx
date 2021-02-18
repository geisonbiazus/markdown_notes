import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  CenteredContainer,
  Form,
  FormRow,
  NarrowContainer,
  TextField,
} from '../../shared/components';
import { useAuthenticationContext } from '../AuthenticationReactContext';

export const SignUp: React.FC = () => {
  const { signUpState, signUpInteractor } = useAuthenticationContext();
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Create a new account')}</h3>
        <Form onSubmit={signUpInteractor.signUp}>
          <FormRow>
            <TextField
              label={t('Name')}
              type="text"
              value={signUpState.name}
              onChange={signUpInteractor.setName}
              errorField="name"
              errorType={signUpState.errors.name}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Email')}
              type="email"
              value={signUpState.email}
              onChange={signUpInteractor.setEmail}
              errorField="email"
              errorType={signUpState.errors.email}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Password')}
              type="password"
              value={signUpState.password}
              onChange={signUpInteractor.setPassword}
              errorField="password"
              errorType={signUpState.errors.password}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Confirm password')}
              type="password"
              value={signUpState.passwordConfirmation}
              onChange={signUpInteractor.setPasswordConfirmation}
              errorField="passwordConfirmation"
              errorType={signUpState.errors.passwordConfirmation}
            />
          </FormRow>
          <Button variant="primary" type="submit">
            {t('Sign up')}
          </Button>
        </Form>
        <div className="margin-top-1">
          {t('Already have an account?')} <Link to="/sign_in">{t('Sign in')}</Link>
        </div>
      </NarrowContainer>
    </CenteredContainer>
  );
};