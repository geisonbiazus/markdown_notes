import express from 'express';
import request from 'supertest';
import { Router } from './router';
import { uuid } from '../utils';

const app = express().use('/', new Router().router);

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
});
