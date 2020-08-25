import React from 'react';
import { useHistory } from 'react-router-dom';
import { uuid } from '../../utils';
import { Button } from '../../shared/components';
import { useTranslation } from 'react-i18next';

export const NewNoteButton: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const newNote = () => {
    history.push(`/notes/${uuid()}`);
  };

  return (
    <Button variant="primary" onClick={newNote}>
      {t('New note')}
    </Button>
  );
};
