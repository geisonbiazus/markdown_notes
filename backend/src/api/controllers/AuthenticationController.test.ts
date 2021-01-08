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
        .expect(404, { type: 'not_found' }, done);
    });

    it('returns token when successful', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password });

      const response = await request(server)
        .post('/sign_in')
        .send({ email: email, password: password })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.token).toBeDefined();
    });
  });

  describe('POST /users/register', () => {
    it('returns the created user when sucessful', async () => {
      const email = 'user@example.com';

      await request(server)
        .post('/users/register')
        .send({ email: email, password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(201, { email, status: 'pending' });
    });

    it('returns validation errors when request is invalid', async () => {
      const email = 'user@example.com';

      await request(server)
        .post('/users/register')
        .expect('Content-Type', /json/)
        .expect(422, [
          { field: 'email', type: 'required' },
          { field: 'password', type: 'required' },
        ]);
    });

    it('returns error when email is already taken', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password });

      await request(server)
        .post('/users/register')
        .send({ email: email, password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(409, { type: 'email_not_available' });
    });
  });
});
