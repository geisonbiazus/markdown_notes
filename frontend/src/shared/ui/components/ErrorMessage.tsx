import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Form } from 'react-bootstrap';

export interface FieldErrorMessageProps {
  field?: string;
  type?: string;
}

export const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({ field, type }) => {
  const { t } = useTranslation();

  if (!type || !field) return null;

  return (
    <Form.Control.Feedback type="invalid">
      {t(`validation.${type}`, { field: t(field) })}
    </Form.Control.Feedback>
  );
};

export interface FormErrorMessageProps {
  feature?: string;
  type?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ feature, type }) => {
  const { t } = useTranslation();

  if (!type || !feature) return null;

  return <Alert variant="danger">{t(`error.${feature}.${type}`)}</Alert>;
};
