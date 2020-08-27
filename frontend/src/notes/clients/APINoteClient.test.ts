import nock from 'nock';

import { APINoteClient } from './APINoteClient';
import { Note } from '../interactors';
import { uuid, HTTPClient } from '../../utils';

HTTPClient.useNodeAdapter();

describe('APINoteClient', () => {
  let client: APINoteClient;
  const baseURL = 'http://localhost:4000';
  const nockScope = nock(baseURL);

  beforeEach(() => {
    client = new APINoteClient(new HTTPClient(baseURL));
    nock.cleanAll();
  });

  afterEach(() => {
    nockScope.done();
  });

  describe('saveNote', () => {
    it('requests to save the note throught the api and return success response', async () => {
      const note: Note = { id: uuid(), body: 'body', title: 'title' };
      const expectedResponse = { status: 'success', note };

      nockScope
        .put(`/notes/${note.id}`, { title: note.title, body: note.body })
        .reply(200, expectedResponse);

      const response = await client.saveNote(note);

      expect(response).toEqual(expectedResponse);
    });

    it('returns api errors when invalid', async () => {
      const note: Note = { id: uuid(), body: 'body', title: '' };
      const expectedResponse = {
        status: 'validation_error',
        errors: [{ field: 'title', type: 'required' }],
      };

      nockScope
        .put(`/notes/${note.id}`, { title: note.title, body: note.body })
        .reply(200, expectedResponse);

      const response = await client.saveNote(note);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getNote', () => {
    it('returns null when the note is not found', async () => {
      const id = uuid();

      nockScope.get(`/notes/${id}`).reply(404, { status: 'error', type: 'not_found' });

      const response = await client.getNote(id);

      expect(response).toEqual(null);
    });

    it('returns the note when the note is found', async () => {
      const note: Note = { id: uuid(), body: 'body', title: '' };

      nockScope.get(`/notes/${note.id}`).reply(200, { status: 'success', note });

      const response = await client.getNote(note.id);

      expect(response).toEqual(note);
    });
  });

  describe('getNotes', () => {
    it('returns a list of notes when request is successful', async () => {
      const notes: Note[] = [
        { id: uuid(), body: 'body 1', title: 'title 1' },
        { id: uuid(), body: 'body 2', title: 'title 2' },
      ];

      nockScope.get(`/notes`).reply(200, { status: 'success', notes: notes });

      const response = await client.getNotes();

      expect(response).toEqual(notes);
    });

    it('throws error when request is not successfull', async () => {
      nockScope.get(`/notes`).reply(500, 'Anything');
      let error: Error | null = null;

      try {
        await client.getNotes();
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(new Error('Something went wrong. Status: 500. Body: Anything'));
    });
  });
});
