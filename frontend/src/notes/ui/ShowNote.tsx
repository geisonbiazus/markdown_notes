import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Loading } from '../../shared/components';
import { useNoteContext } from '../NoteReactContext';

export const ShowNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNoteState, showNoteInteractor } = useNoteContext();
  const { t } = useTranslation();

  useEffect(() => {
    showNoteInteractor.getNote(id);
  }, [showNoteInteractor, id]);

  if (showNoteState.getNotePending) {
    return <Loading />;
  }

  if (showNoteState.isFound && showNoteState.note) {
    return (
      <>
        <h1>{showNoteState.note.title}</h1>
        {(showNoteState.note.html && <NoteHTML html={showNoteState.note.html} />) || <NoContent />}
      </>
    );
  }

  return <h3>{t('Note not found')}</h3>;
};

const NoteHTML: React.FC<{ html: string }> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

const NoContent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <p>
      <i>{t('No content')}</i>
    </p>
  );
};
