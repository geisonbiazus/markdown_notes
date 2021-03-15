import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const Loading: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Spinner className="mr-2" as="span" animation="border" size="sm" />
      {t('Loading')}
    </div>
  );
};
