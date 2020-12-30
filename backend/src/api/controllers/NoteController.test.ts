import { Express } from 'express';
import request from 'supertest';
import { AppContext } from '../../AppContext';
import { User } from '../../authentication';
import { Note, NoteRepository } from '../../notes';
import { uuid } from '../../utils';
import { authenticate, createUser } from '../helpers';
import { Server } from '../index';

describe('NoteController', () => {
  let context: AppContext;
  let server: Express;
  let repo: NoteRepository;
  let user: User;
  let token: string;

  beforeEach(async () => {
    context = new AppContext();
    repo = context.notes.noteRepository;
    server = new Server(context).server;

    user = await createUser(context);
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
        .expect(200, { id: noteId, title: 'title', body: 'body', html: '<p>body</p>\n' }, done);
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
      repo.saveNote(
        new Note({
          id: noteId,
          title: 'title',
          body: 'body',
          html: '<p>body</p>\n',
          userId: user.id,
        })
      );

      request(server)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, { id: noteId, title: 'title', body: 'body', html: '<p>body</p>\n' }, done);
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
      const note1 = new Note({ id: uuid(), title: 'title 1', body: 'body', userId: user.id });
      const note2 = new Note({ id: uuid(), title: 'title 2', body: 'body', userId: user.id });

      repo.saveNote(note1);
      repo.saveNote(note2);

      const noteJSON1 = { id: note1.id, title: note1.title, body: note1.body, html: note1.html };
      const noteJSON2 = { id: note2.id, title: note2.title, body: note2.body, html: note2.html };

      request(server)
        .get(`/notes`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, [noteJSON1, noteJSON2], done);
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
