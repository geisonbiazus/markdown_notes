import React, { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNoteContext } from './NoteContext';
import { Form, FormRow, TextField, TextArea, Button } from '../../shared/components';
import { useAsyncAction } from '../../shared/hooks';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote, getNote, setTitle, setBody } = useNoteContext();
  const { id } = useParams();

  const { pending: SaveNotePending, execute: saveNoteAction } = useAsyncAction(saveNote);

  const { title, body } = editNoteState.note;

  useEffect(() => {
    getNote(id);
  }, [getNote, id]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await saveNoteAction();
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormRow>
        <TextField
          label="Title"
          placeholder="Enter title"
          value={title}
          onChange={onChangeTitle}
          errorField="title"
          errorType={editNoteState.errors.title}
          disabled={SaveNotePending}
        />
      </FormRow>
      <FormRow>
        <TextArea
          label="Content"
          placeholder="Enter content"
          value={body}
          onChange={onChangeBody}
          rows={20}
          errorField="body"
          errorType={editNoteState.errors.body}
          disabled={SaveNotePending}
        />
      </FormRow>
      <Button variant="primary" type="submit" loading={SaveNotePending} disabled={SaveNotePending}>
        Save
      </Button>
    </Form>
  );
};
