import { InMemoryAuthenticationClient } from '../adapters/authenticationClient/InMemoryAuthenticationClient';
import { SignUpStore, SignUpState } from './SignUpStore';

describe('SignUpStore', () => {
  let client: InMemoryAuthenticationClient;
  let store: SignUpStore;

  const emptyState: SignUpState = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: {},
    finished: false,
    pending: false,
  };

  beforeEach(() => {
    client = new InMemoryAuthenticationClient();
    store = new SignUpStore(client);
  });

  describe('constructor', () => {
    it('initializes with an empty state', () => {
      expect(store.state).toEqual(emptyState);
    });
  });

  describe('cleanUp', () => {
    it('resets the state', async () => {
      store.setEmail('invalid');
      await store.signUp();
      store.cleanUp();

      expect(store.state).toEqual(emptyState);
    });
  });

  describe('signUp', () => {
    describe('with an invalid input', () => {
      it('validates required fields', async () => {
        await store.signUp();
        expect(store.state.errors).toEqual({
          name: 'required',
          email: 'required',
          password: 'required',
          passwordConfirmation: 'required',
        });
      });

      it('validates email format', async () => {
        store.setEmail('invalid');
        await store.signUp();

        expect(store.state.errors.email).toEqual('invalid_email');
      });

      it('validates password matching confirmation', async () => {
        store.setPassword('password');
        store.setPasswordConfirmation('invalid_password');
        await store.signUp();

        expect(store.state.errors.password).toEqual('does_not_match_confirmation');
      });

      it('validates password minimum length of 8 characters', async () => {
        store.setPassword('1234567');
        await store.signUp();

        expect(store.state.errors.password).toEqual('length_min_8_chars');
      });
    });

    describe('with a valid input', () => {
      beforeEach(() => {
        store.setName('Name');
        store.setEmail('user@example.com');
        store.setPassword('password');
        store.setPasswordConfirmation('password');
      });

      it('does not return errors with all fields valid', async () => {
        await store.signUp();
        expect(store.state.errors).toEqual({});
      });

      it('requests to sign the user up in the client', async () => {
        await store.signUp();

        expect(client.lastUser).not.toBeUndefined();
        expect(client.lastUser.name).toEqual('Name');
        expect(client.lastUser.email).toEqual('user@example.com');
        expect(client.lastUser.password).toEqual('password');
      });

      it('sets registrationFinished to true', async () => {
        await store.signUp();
        expect(store.state.finished).toEqual(true);
      });

      it('adds error when email is not available in the client', async () => {
        client.addActiveUser('User', 'user@example.com', 'anything', 'token');

        await store.signUp();

        expect(store.state.errors).toEqual({ email: 'not_available' });
      });
    });
  });
});
