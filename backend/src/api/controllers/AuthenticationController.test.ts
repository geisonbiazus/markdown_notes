import { Express } from 'express';
import request from 'supertest';
import { AppContext } from '../../AppContext';
import { Server } from '../server';

describe('AuthenticationController', () => {
  let context: AppContext;
  let server: Express;

  beforeEach(() => {
    context = new AppContext();
    server = new Server(context).server;
  });

  describe('POST /users/sign_in', () => {
    it('returns error when invalid', (done) => {
      request(server)
        .post('/users/sign_in')
        .send({ email: 'user@example.com', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(404, { type: 'not_found' }, done);
    });

    it('returns error when user is pending', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password, status: 'pending' });

      await request(server)
        .post('/users/sign_in')
        .send({ email: email, password: password })
        .expect('Content-Type', /json/)
        .expect(403, { type: 'pending_user' });
    });

    it('returns token when successful', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password, status: 'active' });

      const response = await request(server)
        .post('/users/sign_in')
        .send({ email: email, password: password })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.token).toBeDefined();
    });
  });

  describe('POST /users/register', () => {
    it('returns the created user when sucessful', async () => {
      const name = 'User Name';
      const email = 'user@example.com';

      await request(server)
        .post('/users/register')
        .send({ name, email: email, password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(201, { name, email, status: 'pending' });
    });

    it('returns validation errors when request is invalid', async () => {
      await request(server)
        .post('/users/register')
        .expect('Content-Type', /json/)
        .expect(422, [
          { field: 'name', type: 'required' },
          { field: 'email', type: 'required' },
          { field: 'password', type: 'required' },
        ]);
    });

    it('returns error when email is already taken', async () => {
      const name = 'User Name';
      const email = 'user@example.com';
      const password = 'password';
      await context.authentication.entityFactory.createUser({ email, password });

      await request(server)
        .post('/users/register')
        .send({ name, email, password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(409, { type: 'email_not_available' });
    });
  });

  describe('POST /users/activate', () => {
    it('returns 202 when user is successfully activated', async () => {
      const user = await context.authentication.entityFactory.createUser({ status: 'pending' });
      const token = context.authentication.tokenManager.encode(user.id);

      await request(server)
        .post('/users/activate')
        .send({ token })
        .expect('Content-Type', /json/)
        .expect(202);
    });

    it('returns 404 when token ist invalid', async () => {
      await request(server)
        .post('/users/activate')
        .send({ token: 'invalid' })
        .expect('Content-Type', /json/)
        .expect(404, { type: 'not_found' });
    });
  });
});
