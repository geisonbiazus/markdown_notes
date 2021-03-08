import { Express, Request, Response } from 'express';
import request from 'supertest';

import { Server } from '../server';
import { AppContext } from '../../AppContext';
import { AuthenticationMiddleware } from './AuthenticationMiddleware';
import { json, uuid } from '../../utils';
import { authenticate, createUser } from '../helpers';
import { User } from '../../authentication/entities/User';

describe('authentication', () => {
  let context: AppContext;
  let server: Express;
  let middleware: AuthenticationMiddleware;

  beforeEach(() => {
    context = new AppContext();
    server = new Server(context).server;
    middleware = new AuthenticationMiddleware(context.authentication.facade);

    server.get(
      '/protected',
      middleware.authenticate((req: Request, res: Response, user: User) => {
        res.status(200);
        res.json(user);
      })
    );
  });

  it('returns error when user is not authorized', async () => {
    const response = await request(server)
      .get('/protected')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ type: 'unauthorized' });
  });

  it('returns error when token is invalid', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Bearer INVALID_TOKEN')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ type: 'unauthorized' });
  });

  it('returns error when token is valid but used does not exist', async () => {
    const token = context.authentication.tokenManager.encode(uuid());

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ type: 'unauthorized' });
  });

  it('returns error when token is expired', async () => {
    const user = await createUser(context);
    const token = context.authentication.tokenManager.encode(user.id, 0);

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ type: 'unauthorized' });
  });

  it('successfully proceeds when user is authorized and inject the user in the request', async () => {
    const user = await createUser(context);
    const token = authenticate(context, user);

    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(json(user));
  });
});
