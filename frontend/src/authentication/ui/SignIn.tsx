import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  CenteredContainer,
  Form,
  FormRow,
  NarrowContainer,
  TextField,
} from '../../shared/components';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <NarrowContainer>
        <h3>{t('Please sign in')}</h3>
        <Form>
          <FormRow>
            <TextField label={t('Email')} type="email" />
          </FormRow>
          <FormRow>
            <TextField label={t('Password')} type="password" />
          </FormRow>
          <Button>{t('Sign in')}</Button>
        </Form>
      </NarrowContainer>
    </CenteredContainer>
  );
};
