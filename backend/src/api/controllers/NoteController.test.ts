import request from 'supertest';
import { Server } from '../index';
import { uuid } from '../../utils';

const server = new Server().server;

describe('NoteController', () => {
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
});
