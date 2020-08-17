import React, { ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNote } from './NoteContext';
import { Form, FormRow, TextField, TextArea, Button } from '../../shared/components';

export const EditNote: React.FC = () => {
  const { editNoteState, saveNote, getNote, setTitle, setBody } = useNote();
  const { id } = useParams();

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

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    saveNote();
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <TextField
            label="Title"
            placeholder="Enter title"
            value={title}
            onChange={onChangeTitle}
            errorField="title"
            errorType={editNoteState.errors.title}
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
          />
        </FormRow>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};
