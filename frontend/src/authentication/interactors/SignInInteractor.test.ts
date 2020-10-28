import { newSignInState, SignInInteractor } from './SignInInteractor';

describe('newSignInState', () => {
  it('retuns an empty state', () => {
    expect(newSignInState()).toEqual({ email: '', password: '', errors: {} });
  });
});

describe('SignInInteractor', () => {
  let interactor: SignInInteractor;

  beforeEach(() => {
    interactor = new SignInInteractor();
  });

  describe('signIn', () => {
    it('validates required email and password', async () => {
      let state = newSignInState();
      state = await interactor.signIn(state);

      expect(state.errors).toEqual({ email: 'required', password: 'required' });

      state = interactor.setEmail(state, 'user@example.com');
      state = interactor.setPassword(state, 'password');
      state = await interactor.signIn(state);

      expect(state.errors).toEqual({});
    });
  });
});
