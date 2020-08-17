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
    it('reteurns null when the note is not found', async () => {
      const id = uuid();

      nockScope.get(`/notes/${id}`).reply(404, { status: 'error', type: 'not_found' });

      const response = await client.getNote(id);

      expect(response).toEqual(null);
    });

    it('reteurns the note when the note is found', async () => {
      const note: Note = { id: uuid(), body: 'body', title: '' };

      nockScope.get(`/notes/${note.id}`).reply(404, { status: 'success', note });

      const response = await client.getNote(note.id);

      expect(response).toEqual(note);
    });
  });
});
