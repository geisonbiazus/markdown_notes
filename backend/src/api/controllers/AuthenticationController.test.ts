import { Express } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { AppContext } from '../../AppContext';

describe('AuthenticationController', () => {
  let context: AppContext;
  let server: Express;

  beforeEach(() => {
    context = new AppContext();
    server = new Server(context).server;
  });

  describe('POST /sign_in', () => {
    it('returns error when invalid', (done) => {
      request(server)
        .post('/sign_in')
        .send({ email: 'user@example.com', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(404, { status: 'error', type: 'not_found' }, done);
    });

    it('returns token when successful', async () => {
      const email = 'user@exmaple.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password });

      const response = await request(server)
        .post('/sign_in')
        .send({ email: email, password: password })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toEqual('success');
      expect(response.body.token).toBeDefined();
    });
  });
});
