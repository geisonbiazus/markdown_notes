import { Express } from 'express';
import request from 'supertest';

import { Server } from '../server';
import { AppContext } from '../../AppContext';
import { InMemoryNoteRepository } from '../../notes';
import { authentication } from './authentication';
import { InMemoryAuthenticationRepository, User } from '../../authentication';

describe('authentication', () => {
  let context: AppContext;
  let server: Express;
  let repo: InMemoryAuthenticationRepository;

  beforeEach(() => {
    context = new AppContext();
    repo = context.authenticationRepository as InMemoryAuthenticationRepository;
    server = new Server(context).server;

    server.get('/protected', authentication, function (req, res, next) {
      res.status(200);
      res.json({ status: 'success' });
    });
  });

  it('returns error when user is not authorized', async () => {
    const response = await request(server)
      .get('/protected')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ status: 'error', type: 'unauthorized' });
  });

  it('successfully proceeds when user is authorized', async () => {
    const email = 'user@exmaple.com';
    const password = 'password';
    const hashedPassword = await context.passwordManager.hashPassword(password, email);

    repo.saveUser(
      new User({
        email: email,
        password: hashedPassword,
      })
    );

    const authResp = await context.authenticationInteractor.authenticate(email, password);
    const token = authResp.data!.token;

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ status: 'success' });
  });
});
