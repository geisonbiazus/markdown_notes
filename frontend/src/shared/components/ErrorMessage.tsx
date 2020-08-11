import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ErrorMessageProps {
  field: string;
  type?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ field, type }) => {
  const { t } = useTranslation();

  if (!type) return null;

  return <div>{t(`validation.${type}`, { field: t(field) })}</div>;
};
