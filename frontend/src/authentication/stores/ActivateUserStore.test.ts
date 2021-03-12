import { InMemoryAuthenticationClient } from '../adapters/authenticationClient/InMemoryAuthenticationClient';
import { ActivateUserStore, ActivateUserState } from './ActivateUserStore';

describe('ActivateUserStore', () => {
  let client: InMemoryAuthenticationClient;
  let store: ActivateUserStore;

  const emptyState: ActivateUserState = {
    status: 'idle',
  };

  beforeEach(() => {
    client = new InMemoryAuthenticationClient();
    store = new ActivateUserStore(client);
  });

  describe('constructor', () => {
    it('initializes with an empry state', () => {
      expect(store.state).toEqual(emptyState);
    });
  });

  describe('activate', () => {
    it('activates the user and sets activated to true', async () => {
      const token = 'token';

      client.addPendingUser('name', 'email', 'password', token);

      await store.activate(token);

      expect(client.lastUser.status).toEqual('active');
      expect(store.state.status).toEqual('activated');
    });

    it('sets notFound to true when token is not valid', async () => {
      await store.activate('invalid_token');
      expect(store.state.status).toEqual('not_found');
    });
  });
});
