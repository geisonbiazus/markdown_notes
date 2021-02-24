import { FakePublisher } from '../../utils';
import { InMemoryAuthenticationClient } from '../clients';
import { SignUpInteractor, SignUpState } from './SignUpInteractor';

describe('SignUpinteractor', () => {
  let client: InMemoryAuthenticationClient;
  let publisher: FakePublisher;
  let interactor: SignUpInteractor;

  const emptyState: SignUpState = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: {},
    finished: false,
  };

  beforeEach(() => {
    client = new InMemoryAuthenticationClient();
    publisher = new FakePublisher();
    interactor = new SignUpInteractor(client, publisher);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(interactor.state).toEqual(emptyState);
    });
  });

  describe('cleanUp', () => {
    it('resets the state', async () => {
      interactor.setEmail('invalid');
      await interactor.signUp();
      interactor.cleanUp();

      expect(interactor.state).toEqual(emptyState);
    });
  });

  describe('signUp', () => {
    describe('with an invalid input', () => {
      it('validates required fields', async () => {
        await interactor.signUp();
        expect(interactor.state.errors).toEqual({
          name: 'required',
          email: 'required',
          password: 'required',
          passwordConfirmation: 'required',
        });
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

        expect(interactor.state.errors.password).toEqual('does_not_match_confirmation');
      });

      it('validates password minimum length of 8 characters', async () => {
        interactor.setPassword('1234567');
        await interactor.signUp();

        expect(interactor.state.errors.password).toEqual('length_min_8_chars');
      });

      it('does not publish any event', async () => {
        await interactor.signUp();
        expect(publisher.lastEvent).toBeUndefined();
      });
    });

    describe('with a valid input', () => {
      beforeEach(() => {
        interactor.setName('Name');
        interactor.setEmail('user@example.com');
        interactor.setPassword('password');
        interactor.setPasswordConfirmation('password');
      });

      it('does not return errors with all fields valid', async () => {
        await interactor.signUp();
        expect(interactor.state.errors).toEqual({});
      });

      it('requests to sign the user up in the client', async () => {
        await interactor.signUp();

        expect(client.lastUser).not.toBeUndefined();
        expect(client.lastUser.name).toEqual('Name');
        expect(client.lastUser.email).toEqual('user@example.com');
        expect(client.lastUser.password).toEqual('password');
      });

      it('sets registrationFinished to true', async () => {
        await interactor.signUp();
        expect(interactor.state.finished).toEqual(true);
      });

      it('adds error and do not publish the event when email is not available in the client', async () => {
        client.addActiveUser('User', 'user@example.com', 'anything', 'token');

        await interactor.signUp();

        expect(interactor.state.errors).toEqual({ email: 'not_available' });
        expect(publisher.lastEvent).toBeUndefined();
      });
    });
  });
});
