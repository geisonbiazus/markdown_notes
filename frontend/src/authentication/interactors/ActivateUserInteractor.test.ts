import { InMemoryAuthenticationClient } from '../clients';
import { ActivateUserInteractor, ActivateUserState } from './ActivateUserInteractor';

describe('ActivateUserInteractor', () => {
  let client: InMemoryAuthenticationClient;
  let interactor: ActivateUserInteractor;

  const emptyState: ActivateUserState = {
    status: 'idle',
  };

  beforeEach(() => {
    client = new InMemoryAuthenticationClient();
    interactor = new ActivateUserInteractor(client);
  });

  describe('constructor', () => {
    it('initializes with an empry state', () => {
      expect(interactor.state).toEqual(emptyState);
    });
  });

  describe('activate', () => {
    it('activates the user and sets activated to true', async () => {
      const token = 'token';

      client.addPendingUser('name', 'email', 'password', token);

      await interactor.activate(token);

      expect(client.lastUser.status).toEqual('active');
      expect(interactor.state.status).toEqual('activated');
    });

    it('sets notFound to true when token is not valid', async () => {
      await interactor.activate('invalid_token');
      expect(interactor.state.status).toEqual('not_found');
    });
  });
});
