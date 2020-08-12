import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';

export interface ErrorMessageProps {
  field?: string;
  type?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ field, type }) => {
  const { t } = useTranslation();

  if (!type || !field) return null;

  return (
    <Form.Control.Feedback type="invalid">
      {t(`validation.${type}`, { field: t(field) })}
    </Form.Control.Feedback>
  );
};
