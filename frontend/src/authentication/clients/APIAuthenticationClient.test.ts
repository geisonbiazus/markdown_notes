import nock from 'nock';
import { HTTPClient } from '../../utils';
import { APIAuthenticationClient } from './APIAuthenticationClient';

HTTPClient.useNodeAdapter();

describe('APIAuthenticationClient', () => {
  let client: APIAuthenticationClient;
  const baseURL = 'http://localhost:4000';
  const nockScope = nock(baseURL);

  beforeEach(() => {
    client = new APIAuthenticationClient(new HTTPClient(baseURL));
    nock.cleanAll();
  });

  afterEach(() => {
    nockScope.done();
  });

  describe('signIn', () => {
    it('requests to sign in the user and returns the token when successful', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';

      nockScope.post(`/users/sign_in`, { email, password }).reply(200, { token });

      const response = await client.signIn(email, password);
      expect(response).toEqual({ status: 'success', token });
    });

    it('returns error when authentication fails', async () => {
      const email = 'user@example.com';
      const password = 'password';

      nockScope.post(`/users/sign_in`, { email, password }).reply(404, { type: 'not_found' });

      const response = await client.signIn(email, password);
      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('returns error when user is pending', async () => {
      const email = 'user@example.com';
      const password = 'password';

      nockScope.post(`/users/sign_in`, { email, password }).reply(403, { type: 'pending_user' });

      const response = await client.signIn(email, password);
      expect(response).toEqual({ status: 'error', type: 'pending_user' });
    });

    it('throws if an unexpected response returns', async () => {
      const email = 'user@example.com';
      const password = 'password';

      nockScope.post(`/users/sign_in`, { email, password }).reply(500, { type: 'unexpected' });

      let error: Error | null = null;

      try {
        await client.signIn(email, password);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error('Something went wrong. Status: 500. Body: {"type":"unexpected"}')
      );
    });
  });

  describe('signUp', () => {
    it('requests to register the user and returns success', async () => {
      const name = 'Name';
      const email = 'user@example.com';
      const password = 'password';

      nockScope
        .post(`/users/register`, { name, email, password })
        .reply(201, { name, email, status: 'pending' });

      const response = await client.signUp({ name, email, password });
      expect(response).toEqual({ status: 'success' });
    });

    it('returns email_not_available error when email is already registered', async () => {
      const name = 'Name';
      const email = 'user@example.com';
      const password = 'password';

      nockScope
        .post(`/users/register`, { name, email, password })
        .reply(409, { type: 'email_not_available' });

      const response = await client.signUp({ name, email, password });
      expect(response).toEqual({ status: 'error', type: 'email_not_available' });
    });

    it('throws error if any other response is returned', async () => {
      const name = 'Name';
      const email = 'user@example.com';
      const password = 'password';

      nockScope
        .post(`/users/register`, { name, email, password })
        .reply(500, { type: 'unexpected' });

      let error: Error | null = null;

      try {
        await client.signUp({ name, email, password });
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error('Something went wrong. Status: 500. Body: {"type":"unexpected"}')
      );
    });
  });

  describe('activateUser', () => {
    it('returns success when user is activated', async () => {
      const token = 'token';

      nockScope.post('/users/activate', { token }).reply(202);

      const response = await client.activateUser(token);
      expect(response).toEqual({ status: 'success' });
    });

    it('returns error when token is not found', async () => {
      const token = 'token';

      nockScope.post('/users/activate', { token }).reply(404);

      const response = await client.activateUser(token);
      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('throws error if any other response is returned', async () => {
      const token = 'token';

      nockScope.post('/users/activate', { token }).reply(500, { type: 'unexpected' });

      let error: Error | null = null;

      try {
        await client.activateUser(token);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error('Something went wrong. Status: 500. Body: {"type":"unexpected"}')
      );
    });
  });
});
