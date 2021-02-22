import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  CenteredContainer,
  FormErrorMessage,
  Form,
  FormRow,
  NarrowContainer,
  TextField,
  Button,
} from '../../shared/components';
import { useAuthenticationContext } from '../AuthenticationReactContext';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { signInState, signInInteractor } = useAuthenticationContext();

  useEffect(() => {
    return signInInteractor.cleanUp;
  }, [signInInteractor]);

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
              value={signInState.email}
              errorType={signInState.errors.email}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Password')}
              type="password"
              onChange={signInInteractor.setPassword}
              errorField="password"
              value={signInState.password}
              errorType={signInState.errors.password}
            />
          </FormRow>
          <Button variant="primary" type="submit">
            {t('Sign in')}
          </Button>
        </Form>
        <div className="margin-top-1">
          {t("Don't have an account?")} <Link to="/sign_up">{t('Sign up')}</Link>
        </div>
      </NarrowContainer>
    </CenteredContainer>
  );
};
