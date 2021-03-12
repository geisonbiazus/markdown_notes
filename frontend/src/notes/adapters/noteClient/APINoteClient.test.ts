import nock from 'nock';
import { HTTPClient } from '../../../utils/HTTPClient';
import { uuid } from '../../../utils/uuid';
import { newNote, Note } from '../../entitites/Note';
import { APINoteClient } from './APINoteClient';

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
      const note: Note = newNote({ id: uuid(), body: 'body', title: 'title' });

      nockScope.put(`/notes/${note.id}`, { title: note.title, body: note.body }).reply(200, note);

      const response = await client.saveNote(note);

      expect(response).toEqual({ status: 'success', note });
    });

    it('returns api errors when invalid', async () => {
      const note: Note = newNote({ id: uuid(), body: 'body', title: '' });
      const errors = [{ field: 'title', type: 'required' }];

      nockScope.put(`/notes/${note.id}`, { title: note.title, body: note.body }).reply(422, errors);

      const response = await client.saveNote(note);

      expect(response).toEqual({ status: 'validation_error', errors });
    });

    it('returns unauthorized status', async () => {
      const note: Note = newNote({ id: uuid(), body: 'body', title: '' });

      nockScope
        .put(`/notes/${note.id}`, { title: note.title, body: note.body })
        .reply(401, { type: 'unauthorized' });

      const response = await client.saveNote(note);

      expect(response).toEqual({ status: 'error', type: 'unauthorized' });
    });
  });

  describe('getNote', () => {
    it('returns null when the note is not found', async () => {
      const id = uuid();

      nockScope.get(`/notes/${id}`).reply(404, { type: 'not_found' });

      const response = await client.getNote(id);

      expect(response).toEqual(null);
    });

    it('returns the note when the note is found', async () => {
      const note: Note = newNote({ id: uuid(), body: 'body', title: '', html: '<p>body</p>' });

      nockScope.get(`/notes/${note.id}`).reply(200, note);

      const response = await client.getNote(note.id);

      expect(response).toEqual(note);
    });

    it('returns null when unauthorized', async () => {
      const note: Note = newNote({ id: uuid(), body: 'body', title: '' });

      nockScope.get(`/notes/${note.id}`).reply(401, { type: 'unauthorized' });

      const response = await client.getNote(note.id);

      expect(response).toBeNull();
    });
  });

  describe('getNotes', () => {
    it('returns a list of notes when request is successful', async () => {
      const notes: Note[] = [
        newNote({ id: uuid(), body: 'body 1', title: 'title 1' }),
        newNote({ id: uuid(), body: 'body 2', title: 'title 2' }),
      ];

      nockScope.get(`/notes`).reply(200, notes);

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

      expect(error).toEqual(new Error('Something went wrong. Status: 500. Body: "Anything"'));
    });

    it('returns empty when unauthorized', async () => {
      nockScope.get(`/notes`).reply(401, { type: 'unauthorized' });

      const response = await client.getNotes();

      expect(response).toEqual([]);
    });
  });

  describe('removeNote', () => {
    it('requests to remove a note', async () => {
      const id = uuid();

      nockScope.delete(`/notes/${id}`).reply(200);

      await client.removeNote(id);
    });

    it('throws error if not successful', async () => {
      const id = uuid();

      nockScope.delete(`/notes/${id}`).reply(404, { type: 'not_found' });

      let error: Error | null = null;

      try {
        await client.removeNote(id);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error('Something went wrong. Status: 404. Body: {"type":"not_found"}')
      );
    });

    it('does not throws when unauthorized', async () => {
      const id = uuid();
      nockScope.delete(`/notes/${id}`).reply(401, { type: 'unauthorized' });

      await client.removeNote(id);
    });
  });
});
