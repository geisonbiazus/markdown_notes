import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNoteContext } from '../NoteReactContext';

export const ShowNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNoteState, showNoteInteractor } = useNoteContext();

  useEffect(() => {
    showNoteInteractor.getNote(id);
  }, [showNoteInteractor, id]);

  if (!showNoteState.note) {
    return <div>Show Note</div>;
  }

  return (
    <>
      <h1>{showNoteState.note.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: showNoteState.note.html }}></div>
    </>
  );
};
