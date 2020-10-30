import { InMemoryAuthenticationClient } from '../clients';
import { InMemorySessionRepository } from '../repositories';
import { newSignInState, SignInInteractor } from './SignInInteractor';

describe('newSignInState', () => {
  it('retuns an empty state', () => {
    expect(newSignInState()).toEqual({ email: '', password: '', errors: {}, success: false });
  });
});

describe('SignInInteractor', () => {
  let interactor: SignInInteractor;
  let authenticationClient: InMemoryAuthenticationClient;
  let sessionRepository: InMemorySessionRepository;

  beforeEach(() => {
    authenticationClient = new InMemoryAuthenticationClient();
    sessionRepository = new InMemorySessionRepository();
    interactor = new SignInInteractor(authenticationClient, sessionRepository);
  });

  describe('signIn', () => {
    it('validates required email and password', async () => {
      let state = newSignInState();
      state = await interactor.signIn(state);

      expect(state.errors).toEqual({ email: 'required', password: 'required' });
    });

    it('returns error when authentication fails', async () => {
      let state = newSignInState();
      state = interactor.setEmail(state, 'user@example.com');
      state = interactor.setPassword(state, 'password');

      state = await interactor.signIn(state);

      expect(state.errors).toEqual({ base: 'not_found' });
    });

    it('saves the session data and sets success when authentication succeds', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const token = 'token';
      authenticationClient.addUser(email, password, token);

      let state = newSignInState();
      state = interactor.setEmail(state, email);
      state = interactor.setPassword(state, password);

      state = await interactor.signIn(state);

      expect(sessionRepository.getToken()).toEqual(token);
      expect(state.success).toEqual(true);
    });
  });
});
