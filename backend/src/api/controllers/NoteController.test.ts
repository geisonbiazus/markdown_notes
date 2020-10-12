import { Express } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { uuid, json } from '../../utils';
import { InMemoryRepository, Note } from '../../notes';
import { AppContext } from '../../AppContext';

describe('NoteController', () => {
  let context: AppContext;
  let server: Express;
  let repo: InMemoryRepository;

  beforeEach(() => {
    context = new AppContext();
    repo = context.noteRepository as InMemoryRepository;
    server = new Server(context).server;
  });

  describe('PUT /notes/:id', () => {
    it('returns errors when invalid', (done) => {
      const noteId = uuid();

      request(server)
        .put(`/notes/${noteId}`)
        .expect('Content-Type', /json/)
        .expect(
          422,
          { status: 'validation_error', errors: [{ field: 'title', type: 'required' }] },
          done
        );
    });

    it('returns the created note when valid', (done) => {
      const noteId = uuid();

      request(server)
        .put(`/notes/${noteId}`)
        .send({ title: 'title', body: 'body' })
        .expect('Content-Type', /application\/json/)
        .expect(
          200,
          { status: 'success', note: { id: noteId, title: 'title', body: 'body' } },
          done
        );
    });
  });

  describe('GET /notes/:id', () => {
    it('returns not found when note does not exist', (done) => {
      const noteId = uuid();

      request(server)
        .get(`/notes/${noteId}`)
        .expect('Content-Type', /json/)
        .expect(404, { status: 'error', type: 'not_found' }, done);
    });

    it('returns note when it exists', (done) => {
      const noteId = uuid();
      repo.saveNote(new Note({ id: noteId, title: 'title', body: 'body' }));

      request(server)
        .get(`/notes/${noteId}`)
        .expect('Content-Type', /json/)
        .expect(
          200,
          { status: 'success', note: { id: noteId, title: 'title', body: 'body' } },
          done
        );
    });
  });

  describe('GET /notes', () => {
    it('returns  an empty list when there is no note', (done) => {
      request(server)
        .get(`/notes/`)
        .expect('Content-Type', /json/)
        .expect(200, { status: 'success', notes: [] }, done);
    });

    it('returns all notes when they exist', (done) => {
      const note1 = new Note({ id: uuid(), title: 'title 1', body: 'body' });
      const note2 = new Note({ id: uuid(), title: 'title 2', body: 'body' });

      repo.saveNote(note1);
      repo.saveNote(note2);

      request(server)
        .get(`/notes`)
        .expect('Content-Type', /json/)
        .expect(200, { status: 'success', notes: json([note1, note2]) }, done);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('returns not found error when note does not exist', (done) => {
      request(server)
        .delete(`/notes/${uuid()}`)
        .expect('Content-Type', /json/)
        .expect(404, { status: 'error', type: 'not_found' }, done);
    });

    it('returns success and removes the note when it exists', (done) => {
      const id = uuid();
      repo.saveNote(new Note({ id, title: 'title', body: 'body' }));

      request(server)
        .delete(`/notes/${id}`)
        .expect('Content-Type', /json/)
        .expect(200, { status: 'success' }, done);
    });
  });
});
