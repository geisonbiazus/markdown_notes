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

    it('does not return errors with all fields valid', async () => {
      interactor.setName('Name');
      interactor.setEmail('user@example.com');
      interactor.setPassword('password');
      interactor.setPasswordConfirmation('password');

      await interactor.signUp();
      expect(interactor.state.errors).toEqual({});
    });

    it('validates email format', async () => {
      interactor.setEmail('invalid');
      await interactor.signUp();

      expect(interactor.state.errors.email).toEqual('invalid_email');
    });

    it('validates password matching confirmation', async () => {
      interactor.setPassword('password');
      interactor.setPasswordConfirmation('invalid_password');
      await interactor.signUp();

      expect(interactor.state.errors.password).toEqual('does_not_mach_confirmation');
    });
  });
});
