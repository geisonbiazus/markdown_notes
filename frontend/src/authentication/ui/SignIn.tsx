import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import { FormErrorMessage } from '../../shared/components/ErrorMessage';
import { Form, FormRow, TextField } from '../../shared/components/Form';
import { CenteredContainer, NarrowContainer } from '../../shared/components/Layout';
import { useAuthenticationContext } from '../AuthenticationReactContext';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { signInState, signInStore } = useAuthenticationContext();

  useEffect(() => {
    return signInStore.cleanUp;
  }, [signInStore]);

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Please sign in')}</h3>
        <Form onSubmit={signInStore.signIn}>
          <FormErrorMessage feature="sign_in" type={signInState.errors.base} />
          <FormRow>
            <TextField
              label={t('Email')}
              type="email"
              onChange={signInStore.setEmail}
              errorField="email"
              value={signInState.email}
              errorType={signInState.errors.email}
              disabled={signInState.pending}
            />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Password')}
              type="password"
              onChange={signInStore.setPassword}
              errorField="password"
              value={signInState.password}
              errorType={signInState.errors.password}
              disabled={signInState.pending}
            />
          </FormRow>
          <Button variant="primary" type="submit" loading={signInState.pending}>
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
