import { Express, response } from 'express';
import request from 'supertest';
import { Server } from '../index';
import { InMemoryRepository, Note } from '../../notes';
import { InMemoryAuthenticationRepository } from '../../authentication/repositories';
import { AppContext } from '../../AppContext';
import { User } from '../../authentication';

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
      const hashedPassword = await context.passwordManager.hashPassword(password, email);

      repo.saveUser(
        new User({
          email: email,
          password: hashedPassword,
        })
      );

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
