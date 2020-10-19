import { Express, Request, Response } from 'express';
import request from 'supertest';

import { Server } from '../server';
import { AppContext } from '../../AppContext';
import { AuthenticationMiddleware } from './authentication';
import { InMemoryAuthenticationRepository, User } from '../../authentication';
import { json, uuid } from '../../utils';

describe('authentication', () => {
  let context: AppContext;
  let server: Express;
  let repo: InMemoryAuthenticationRepository;
  let middleware: AuthenticationMiddleware;
  let user: User;

  beforeEach(() => {
    context = new AppContext();
    repo = context.authenticationRepository as InMemoryAuthenticationRepository;
    server = new Server(context).server;
    middleware = new AuthenticationMiddleware(context.authenticationInteractor);

    server.get(
      '/protected',
      middleware.authenticate((req: Request, res: Response, user: User) => {
        res.status(200);
        res.json({ status: 'success', user: user });
      })
    );
  });

  it('returns error when user is not authorized', async () => {
    const response = await request(server)
      .get('/protected')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ status: 'error', type: 'unauthorized' });
  });

  it('returns error when token is invalid', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Bearer INVALID_TOKEN')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ status: 'error', type: 'unauthorized' });
  });

  it('returns error when token is valid but used does not exist', async () => {
    const token = context.tokenManager.encode(uuid());

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ status: 'error', type: 'unauthorized' });
  });

  it('returns error when token is expired', async () => {
    const [user, _password] = await createUser();

    repo.saveUser(user);

    const token = context.tokenManager.encode(user.id, 0);

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ status: 'error', type: 'unauthorized' });
  });

  it('successfully proceeds when user is authorized and inject the user in the request', async () => {
    const [user, password] = await createUser();

    const authResp = await context.authenticationInteractor.authenticate(user.email, password);
    const token = authResp.data!.token;

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ status: 'success', user: json(user) });
  });

  async function createUser(): Promise<[User, string]> {
    const email = 'user@exmaple.com';
    const password = 'password';
    const hashedPassword = await context.passwordManager.hashPassword(password, email);
    const user = new User({ id: uuid(), email: email, password: hashedPassword });

    repo.saveUser(user);

    return [user, password];
  }
});
