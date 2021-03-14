import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '../../shared/ui/components/Button';
import { uuid } from '../../shared/utils/uuid';
import { useNoteContext } from '../NoteReactContext';

export const NewNoteButton: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { listNoteStore } = useNoteContext();

  const newNote = () => {
    // TODO move this logic to a store
    const noteId = uuid();
    history.push(`/notes/${uuid()}/edit`);
    listNoteStore.setActiveNoteId(noteId);
  };

  return (
    <Button variant="primary" onClick={newNote}>
      {t('New note')}
    </Button>
  );
};
