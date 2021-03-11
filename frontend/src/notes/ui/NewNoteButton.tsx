import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '../../shared/components/Button';
import { uuid } from '../../utils/uuid';
import { useNoteContext } from '../NoteReactContext';

export const NewNoteButton: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { listNoteInteractor } = useNoteContext();

  const newNote = () => {
    // TODO move this logic to an interactor
    const noteId = uuid();
    history.push(`/notes/${uuid()}/edit`);
    listNoteInteractor.setActiveNoteId(noteId);
  };

  return (
    <Button variant="primary" onClick={newNote}>
      {t('New note')}
    </Button>
  );
};
