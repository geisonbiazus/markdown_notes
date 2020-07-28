import express from 'express';
import request from 'supertest';
import { Router } from './router';
import { uuid } from '../utils';

const app = express().use(new Router().router);

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
      .expect(200, { status: 'success', note: { id: noteId, title: 'title', body: 'body' } }, done);
  });
});
