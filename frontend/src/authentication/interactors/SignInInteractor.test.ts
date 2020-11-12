import { StateManager } from '../../utils';
import { InMemoryAuthenticationClient } from '../clients';
import { InMemorySessionRepository } from '../repositories';
import { newSignInState, SignInInteractor, SignInState } from './SignInInteractor';

describe('newSignInState', () => {
  it('retuns an empty state', () => {
    expect(newSignInState()).toEqual({ email: '', password: '', errors: {}, authenticated: false });
  });
});

describe('SignInInteractor', () => {
  let interactor: SignInInteractor;
  let authenticationClient: InMemoryAuthenticationClient;
  let sessionRepository: InMemorySessionRepository;
  let stateManager: StateManager<SignInState>;

  beforeEach(() => {
    authenticationClient = new InMemoryAuthenticationClient();
    sessionRepository = new InMemorySessionRepository();
    stateManager = new StateManager(newSignInState());
    interactor = new SignInInteractor(stateManager, authenticationClient, sessionRepository);
  });

  describe('signIn', () => {
    it('validates required email and password', async () => {
      await interactor.signIn();
      const state = stateManager.getState();

      expect(state.errors).toEqual({ email: 'required', password: 'required' });
    });

    it('returns error when authentication fails', async () => {
      interactor.setEmail('user@example.com');
      interactor.setPassword('password');

      await interactor.signIn();
      const state = stateManager.getState();

      expect(state.errors).toEqual({ base: 'not_found' });
    });

    it('saves the session data and sets success when authentication succeds', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addUser(email, password, token);

      interactor.setEmail(email);
      interactor.setPassword(password);

      await interactor.signIn();
      const state = stateManager.getState();

      expect(sessionRepository.getToken()).toEqual(token);
      expect(state.authenticated).toEqual(true);
    });
  });

  describe('checkAuthentication', () => {
    it('sets authenticated to false when token is note set', () => {
      interactor.checkAuthentication();

      const state = stateManager.getState();

      expect(state.authenticated).toBe(false);
    });

    it('sets authenticated to true when token is set', () => {
      sessionRepository.setToken('token');

      interactor.checkAuthentication();

      const state = stateManager.getState();

      expect(state.authenticated).toBe(true);
    });
  });

  describe('signOut', () => {
    beforeEach(() => {
      stateManager.setState({
        ...stateManager.getState(),
        authenticated: true,
        email: 'user@email.com',
        password: 'password',
      });
    });

    it('cleans the state', () => {
      interactor.signOut();

      const state = stateManager.getState();
      expect(state).toEqual(newSignInState());
    });

    it('cleans the token from the session', () => {
      sessionRepository.setToken('token');
      interactor.signOut();
      expect(sessionRepository.getToken()).toBeNull();
    });
  });
});
