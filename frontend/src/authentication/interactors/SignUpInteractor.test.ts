import { SignUpInteractor } from './SignUpInteractor';

describe('SignUpinteractor', () => {
  let interactor: SignUpInteractor;

  beforeEach(() => {
    interactor = new SignUpInteractor();
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(interactor.state).toEqual({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: {},
      });
    });
  });

  describe('signUp', () => {
    it('validates required fields', async () => {
      await interactor.signUp();
      expect(interactor.state.errors).toEqual({
        name: 'required',
        email: 'required',
        password: 'required',
        passwordConfirmation: 'required',
      });
    });
  });
});
