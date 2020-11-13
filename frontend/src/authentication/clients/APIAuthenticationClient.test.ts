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

      nockScope.post(`/sign_in`, { email, password }).reply(200, { status: 'success', token });

      const response = await client.signIn(email, password);
      expect(response).toEqual(token);
    });

    it('returns null when authentication fails', async () => {
      const email = 'user@example.com';
      const password = 'password';

      nockScope
        .post(`/sign_in`, { email, password })
        .reply(404, { status: 'error', type: 'not_found' });

      const response = await client.signIn(email, password);
      expect(response).toBeNull();
    });

    it('throws if an unexpected response returns', async () => {
      const email = 'user@example.com';
      const password = 'password';

      nockScope
        .post(`/sign_in`, { email, password })
        .reply(500, { status: 'error', type: 'unexpected' });

      let error: Error | null = null;

      try {
        await client.signIn(email, password);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error('Something went wrong. Status: 500. Body: {"status":"error","type":"unexpected"}')
      );
    });
  });
});
