import { FakePublisher } from '../../utils';
import { InMemoryAuthenticationClient } from '../clients';
import { USER_SIGNED_UP_EVENT } from '../events';
import { SignUpInteractor } from './SignUpInteractor';

describe('SignUpinteractor', () => {
  let client: InMemoryAuthenticationClient;
  let publisher: FakePublisher;
  let interactor: SignUpInteractor;

  beforeEach(() => {
    client = new InMemoryAuthenticationClient();
    publisher = new FakePublisher();
    interactor = new SignUpInteractor(client, publisher);
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

      it('publishes user_signed_up event', async () => {
        await interactor.signUp();

        expect(publisher.lastEvent).toEqual({
          name: USER_SIGNED_UP_EVENT,
          payload: { name: 'Name', email: 'user@example.com' },
        });
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