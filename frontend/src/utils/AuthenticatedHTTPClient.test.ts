import nock from 'nock';
import { AuthenticatedHTTPClient } from './AuthenticatedHTTPClient';

AuthenticatedHTTPClient.useNodeAdapter();

describe('AuthenticatedHTTPClient', () => {
  let client: AuthenticatedHTTPClient;
  const token = 'token';
  const baseURL = 'http://example.com';
  const nockScope = nock(baseURL, { reqheaders: { Authorization: `Bearer ${token}` } });
  const params = { some: 'request' };
  const responseBody = { some: 'response' };
  const path = '/path';

  let onUnauthorizedCalled: boolean;

  const onUnauthorized = () => {
    onUnauthorizedCalled = true;
  };

  beforeEach(() => {
    onUnauthorizedCalled = false;
    client = new AuthenticatedHTTPClient(baseURL, token, onUnauthorized);
    nock.cleanAll();
  });

  afterEach(() => {
    nockScope.done();
  });

  describe('get', () => {
    it('injects the authorization token on the request readers', async () => {
      nockScope.get(path).reply(200, responseBody);

      const response = await client.get(path);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(responseBody);
      expect(onUnauthorizedCalled).toBeFalsy();
    });

    it('calls onUnauthorized when 401 is returned', async () => {
      nockScope.get(path).reply(401, responseBody);

      const response = await client.get(path);

      expect(onUnauthorizedCalled).toBeTruthy();
    });
  });

  describe('post', () => {
    it('injects the authorization token on the request readers', async () => {
      nockScope.post(path, params).reply(200, responseBody);

      const response = await client.post(path, params);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(responseBody);
      expect(onUnauthorizedCalled).toBeFalsy();
    });

    it('calls onUnauthorized when 401 is returned', async () => {
      nockScope.post(path, params).reply(401, responseBody);

      const response = await client.post(path, params);

      expect(onUnauthorizedCalled).toBeTruthy();
    });
  });

  describe('put', () => {
    it('injects the authorization token on the request readers', async () => {
      nockScope.put(path, params).reply(200, responseBody);

      const response = await client.put(path, params);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(responseBody);
      expect(onUnauthorizedCalled).toBeFalsy();
    });

    it('calls onUnauthorized when 401 is returned', async () => {
      nockScope.put(path, params).reply(401, responseBody);

      const response = await client.put(path, params);

      expect(onUnauthorizedCalled).toBeTruthy();
    });
  });

  describe('patch', () => {
    it('injects the authorization token on the request readers', async () => {
      nockScope.patch(path, params).reply(200, responseBody);

      const response = await client.patch(path, params);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(responseBody);
      expect(onUnauthorizedCalled).toBeFalsy();
    });

    it('calls onUnauthorized when 401 is returned', async () => {
      nockScope.patch(path, params).reply(401, responseBody);

      const response = await client.patch(path, params);

      expect(onUnauthorizedCalled).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('injects the authorization token on the request readers', async () => {
      nockScope.delete(path, params).reply(200, responseBody);

      const response = await client.delete(path, params);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(responseBody);
      expect(onUnauthorizedCalled).toBeFalsy();
    });

    it('calls onUnauthorized when 401 is returned', async () => {
      nockScope.delete(path, params).reply(401, responseBody);

      const response = await client.delete(path, params);

      expect(onUnauthorizedCalled).toBeTruthy();
    });
  });
});
