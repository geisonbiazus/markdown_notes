import { Express } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { uuid, json } from '../../utils';
import { InMemoryRepository, Note } from '../../notes';
import { InMemoryAuthenticationRepository } from '../../authentication/repositories';
import { AppContext } from '../../AppContext';

describe('AuthenticationController', () => {
  let context: AppContext;
  let server: Express;
  let repo: InMemoryAuthenticationRepository;

  beforeEach(() => {
    context = new AppContext();
    repo = context.authenticationRepository as InMemoryAuthenticationRepository;
    server = new Server(context).server;
  });

  describe('POST /sign_in', () => {
    it('returns errors when invalid', (done) => {
      request(server)
        .post('/sign_in')
        .send({ email: 'user@example.com', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(404, { status: 'error', type: 'not_found' }, done);
    });
  });
});
