import request from 'supertest';
import { router } from './router';
import { uuid } from '../utils';

describe('PUT /notes/:id', () => {
  it('returns errors when invalid', (done) => {
    const noteId = uuid();

    request(router)
      .put(`/notes/${noteId}`)
      .expect('Content-Type', /json/)
      .expect(
        422,
        { status: 'validation_error', errors: [{ field: 'title', type: 'required' }] },
        done
      );
  });
});
