import request from 'supertest';
import { App } from '../index';
import { uuid } from '../../utils';

const app = new App().server;

describe('NoteController', () => {
  describe('PUT /notes/:id', () => {
    it('returns errors when invalid', (done) => {
      const noteId = uuid();

      request(app)
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

      request(app)
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
});
