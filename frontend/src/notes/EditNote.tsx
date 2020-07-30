import React, { useState, ChangeEvent, SyntheticEvent } from 'react';

export const EditNote: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(title, body);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <p>
          <label htmlFor="title">Title</label>
        </p>
        <p>
          <input type="text" id="title" name="title" value={title} onChange={onChangeTitle} />
        </p>
        <p>
          <label htmlFor="body">Content</label>
        </p>
        <p>
          <textarea
            id="body"
            name="body"
            rows={20}
            cols={100}
            value={body}
            onChange={onChangeBody}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Save" />
        </p>
      </form>
    </>
  );
};
