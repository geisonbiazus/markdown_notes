import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useNote } from './NoteContext';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote } = useNote();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { id } = useParams();

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    saveNote({
      id,
      title,
      body,
    });
  };

  console.log(editNoteState);

  return (
    <>
      <form onSubmit={onSubmit}>
        <p>
          <label htmlFor="title">Title</label>
        </p>
        <p>
          <input type="text" id="title" name="title" value={title} onChange={onChangeTitle} />
          {editNoteState.errors.title}
        </p>
        <p>
          <label htmlFor="body">Content</label>
        </p>
        <p>
          <textarea id="body" name="body" rows={20} cols={100} onChange={onChangeBody} />
        </p>
        <p>
          <input type="submit" value="Save" />
        </p>
      </form>
    </>
  );
};
