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

export const SignUp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Create a new account')}</h3>
        <Form onSubmit={() => {}}>
          <FormRow>
            <TextField label={t('Name')} type="text" errorField="name" />
          </FormRow>
          <FormRow>
            <TextField label={t('Email')} type="email" errorField="email" />
          </FormRow>
          <FormRow>
            <TextField label={t('Password')} type="password" errorField="password" />
          </FormRow>
          <FormRow>
            <TextField
              label={t('Confirm password')}
              type="password"
              errorField="password_confirmation"
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
