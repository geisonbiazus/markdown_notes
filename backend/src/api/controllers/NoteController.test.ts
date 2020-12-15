import { Express } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { uuid, json } from '../../utils';
import { InMemoryNoteRepository, Note, NoteRepository } from '../../notes';
import { AppContext } from '../../AppContext';
import { authenticate, createUser } from '../helpers';

describe('NoteController', () => {
  let context: AppContext;
  let server: Express;
  let repo: NoteRepository;
  let token: string;

  beforeEach(async () => {
    context = new AppContext();
    repo = context.notes.noteRepository;
    server = new Server(context).server;

    const user = await createUser(context);
    token = authenticate(context, user);
  });

  describe('PUT /notes/:id', () => {
    it('returns errors when invalid', (done) => {
      const noteId = uuid();

      request(server)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(422, [{ field: 'title', type: 'required' }], done);
    });

    it('returns the created note when valid', (done) => {
      const noteId = uuid();

      request(server)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'title', body: 'body' })
        .expect('Content-Type', /application\/json/)
        .expect(200, { id: noteId, title: 'title', body: 'body' }, done);
    });
  });

  describe('GET /notes/:id', () => {
    it('returns not found when note does not exist', (done) => {
      const noteId = uuid();

      request(server)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404, { type: 'not_found' }, done);
    });

    it('returns note when it exists', (done) => {
      const noteId = uuid();
      repo.saveNote(new Note({ id: noteId, title: 'title', body: 'body' }));

      request(server)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, { id: noteId, title: 'title', body: 'body' }, done);
    });
  });

  describe('GET /notes', () => {
    it('returns  an empty list when there is no note', (done) => {
      request(server)
        .get(`/notes/`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, [], done);
    });

    it('returns all notes when they exist', (done) => {
      const note1 = new Note({ id: uuid(), title: 'title 1', body: 'body' });
      const note2 = new Note({ id: uuid(), title: 'title 2', body: 'body' });

      repo.saveNote(note1);
      repo.saveNote(note2);

      request(server)
        .get(`/notes`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, json([note1, note2]), done);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('returns not found error when note does not exist', (done) => {
      request(server)
        .delete(`/notes/${uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404, { type: 'not_found' }, done);
    });

    it('returns success and removes the note when it exists', (done) => {
      const id = uuid();
      repo.saveNote(new Note({ id, title: 'title', body: 'body' }));

      request(server)
        .delete(`/notes/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
