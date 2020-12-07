import { FakePublisher } from '../../utils';
import { InMemoryAuthenticationClient } from '../clients';
import { InMemorySessionRepository } from '../repositories';
import { SignInInteractor } from './SignInInteractor';

describe('SignInInteractor', () => {
  let interactor: SignInInteractor;
  let authenticationClient: InMemoryAuthenticationClient;
  let sessionRepository: InMemorySessionRepository;
  let publisher: FakePublisher;

  beforeEach(() => {
    authenticationClient = new InMemoryAuthenticationClient();
    sessionRepository = new InMemorySessionRepository();
    publisher = new FakePublisher();
    interactor = new SignInInteractor(authenticationClient, sessionRepository, publisher);
  });

  describe('constructor', () => {
    it('initializes with and empy state', () => {
      expect(interactor.state).toEqual({
        email: '',
        password: '',
        errors: {},
        token: '',
        authenticated: false,
      });
    });
  });

  describe('signIn', () => {
    it('validates required email and password', async () => {
      await interactor.signIn();
      expect(interactor.state.errors).toEqual({ email: 'required', password: 'required' });
    });

    it('returns error when authentication fails', async () => {
      interactor.setEmail('user@example.com');
      interactor.setPassword('password');

      await interactor.signIn();

      expect(interactor.state.errors).toEqual({ base: 'not_found' });
    });

    it('saves the session data and sets success when authentication succeds', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addUser(email, password, token);

      interactor.setEmail(email);
      interactor.setPassword(password);

      await interactor.signIn();

      expect(sessionRepository.getToken()).toEqual(token);
      expect(interactor.state.authenticated).toEqual(true);
      expect(interactor.state.token).toEqual(token);
    });

    it('publishes user_authenticated event', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addUser(email, password, token);

      interactor.setEmail(email);
      interactor.setPassword(password);

      await interactor.signIn();

      expect(publisher.events).toEqual([{ name: 'user_authenticated', payload: { token } }]);
    });
  });

  describe('checkAuthentication', () => {
    it('sets authenticated to false when token is note set', () => {
      interactor.checkAuthentication();

      expect(interactor.state.authenticated).toBe(false);
      expect(interactor.state.token).toEqual('');
    });

    it('sets authenticated to true when token is set', () => {
      const token = 'token';
      sessionRepository.setToken(token);

      interactor.checkAuthentication();

      expect(interactor.state.authenticated).toBe(true);
      expect(interactor.state.token).toEqual(token);
    });

    it('publishes user_authenticated event', () => {
      const token = 'token';
      sessionRepository.setToken(token);

      interactor.checkAuthentication();

      expect(publisher.events).toEqual([{ name: 'user_authenticated', payload: { token } }]);
    });
  });

  describe('signOut', () => {
    beforeEach(async () => {
      const email = 'user@example.com';
      const password = 'password';
      authenticationClient.addUser(email, password, 'token');

      interactor.setEmail(email);
      interactor.setPassword(password);

      await interactor.signIn();
    });

    it('cleans the state', () => {
      interactor.signOut();
      expect(interactor.state.authenticated).toEqual(false);
      expect(interactor.state.email).toEqual('');
      expect(interactor.state.password).toEqual('');
    });

    it('cleans the token from the session', () => {
      interactor.signOut();
      expect(sessionRepository.getToken()).toBeNull();
    });
  });
});
