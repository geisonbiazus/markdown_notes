import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useNote } from './NoteContext';
import { Form, FormRow, TextField, TextArea } from '../../shared/components';
import { Button } from 'react-bootstrap';

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
