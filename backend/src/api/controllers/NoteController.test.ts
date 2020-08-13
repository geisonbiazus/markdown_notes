import { Express } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { uuid } from '../../utils';
import { InMemoryRepository, Note } from '../../notes';

describe('NoteController', () => {
  let server: Express;
  let repo: InMemoryRepository;

  beforeEach(() => {
    repo = new InMemoryRepository();
    server = new Server(repo).server;
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
});
