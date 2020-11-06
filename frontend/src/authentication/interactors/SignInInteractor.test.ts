import { InMemoryStateManager } from '../../utils';
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
  let stateManager: InMemoryStateManager<SignInState>;

  beforeEach(() => {
    authenticationClient = new InMemoryAuthenticationClient();
    sessionRepository = new InMemorySessionRepository();
    stateManager = new InMemoryStateManager(newSignInState());
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
});
