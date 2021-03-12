import { FakePublisher } from '../../utils/pub_sub/FakePublisher';
import { InMemoryAuthenticationClient } from '../adapters/authenticationClient/InMemoryAuthenticationClient';
import { InMemorySessionRepository } from '../adapters/sessionRepository/InMemorySessionRepository';
import { SignInStore, SignInState } from './SignInStore';

describe('SignInStore', () => {
  let store: SignInStore;
  let authenticationClient: InMemoryAuthenticationClient;
  let sessionRepository: InMemorySessionRepository;
  let publisher: FakePublisher;

  let emptyState: SignInState = {
    email: '',
    password: '',
    errors: {},
    token: '',
    authenticated: false,
    pending: false,
  };

  beforeEach(() => {
    authenticationClient = new InMemoryAuthenticationClient();
    sessionRepository = new InMemorySessionRepository();
    publisher = new FakePublisher();
    store = new SignInStore(authenticationClient, sessionRepository, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empy state', () => {
      expect(store.state).toEqual(emptyState);
    });
  });

  describe('cleanUp', () => {
    it('resets the state but keep', async () => {
      store.setEmail('invalid');
      await store.signIn();
      store.cleanUp();

      expect(store.state).toEqual(emptyState);
    });

    it('keeps token and authenticated state', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addActiveUser('Name', email, password, token);

      store.setEmail(email);
      store.setPassword(password);

      await store.signIn();
      store.cleanUp();

      expect(store.state.token).toEqual(token);
      expect(store.state.authenticated).toBeTruthy();
    });
  });

  describe('signIn', () => {
    it('validates required email and password', async () => {
      await store.signIn();
      expect(store.state.errors).toEqual({ email: 'required', password: 'required' });
    });

    it('returns error when authentication fails', async () => {
      store.setEmail('user@example.com');
      store.setPassword('password');

      await store.signIn();

      expect(store.state.errors).toEqual({ base: 'not_found' });
    });

    it('returns error when user is pending', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addPendingUser('Name', email, password, token);

      store.setEmail(email);
      store.setPassword(password);

      await store.signIn();

      expect(store.state.errors).toEqual({ base: 'pending_user' });
    });

    it('saves the session data and sets success when authentication succeds', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addActiveUser('Name', email, password, token);

      store.setEmail(email);
      store.setPassword(password);

      await store.signIn();

      expect(sessionRepository.getToken()).toEqual(token);
      expect(store.state.authenticated).toEqual(true);
      expect(store.state.token).toEqual(token);
    });

    it('publishes user_authenticated event', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addActiveUser('Name', email, password, token);

      store.setEmail(email);
      store.setPassword(password);

      await store.signIn();

      expect(publisher.events).toEqual([{ name: 'user_authenticated', payload: { token } }]);
    });
  });

  describe('checkAuthentication', () => {
    it('sets authenticated to false when token is note set', () => {
      store.checkAuthentication();

      expect(store.state.authenticated).toBe(false);
      expect(store.state.token).toEqual('');
    });

    it('sets authenticated to true when token is set', () => {
      const token = 'token';
      sessionRepository.setToken(token);

      store.checkAuthentication();

      expect(store.state.authenticated).toBe(true);
      expect(store.state.token).toEqual(token);
    });

    it('publishes user_authenticated event', () => {
      const token = 'token';
      sessionRepository.setToken(token);

      store.checkAuthentication();

      expect(publisher.events).toEqual([{ name: 'user_authenticated', payload: { token } }]);
    });
  });

  describe('signOut', () => {
    beforeEach(async () => {
      const email = 'user@example.com';
      const password = 'password';
      authenticationClient.addActiveUser('Name', email, password, 'token');

      store.setEmail(email);
      store.setPassword(password);

      await store.signIn();
    });

    it('cleans the state', () => {
      store.signOut();
      expect(store.state.authenticated).toEqual(false);
      expect(store.state.email).toEqual('');
      expect(store.state.password).toEqual('');
    });

    it('cleans the token from the session', () => {
      store.signOut();
      expect(sessionRepository.getToken()).toBeNull();
    });
  });
});
