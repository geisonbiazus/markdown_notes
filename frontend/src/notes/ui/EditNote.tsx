import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNoteContext } from './NoteContext';
import { Form, FormRow, TextField, TextArea, Button } from '../../shared/components';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote, getNote, setTitle, setBody } = useNoteContext();
  const { id } = useParams();
  const [saveNoteLoading, setSaveNoteLoading] = useState(false);

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
    setSaveNoteLoading(true);
    await saveNote();
    setSaveNoteLoading(false);
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
          disabled={saveNoteLoading}
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
          disabled={saveNoteLoading}
        />
      </FormRow>
      <Button variant="primary" type="submit" loading={saveNoteLoading} disabled={saveNoteLoading}>
        Save
      </Button>
    </Form>
  );
};
