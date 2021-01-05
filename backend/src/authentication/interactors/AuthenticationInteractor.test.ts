import { uuid } from '../../utils';
import { ValidationError } from '../../utils/validations';
import { PasswordManager, TokenManager, User } from '../entities';
import { EntityFactory } from '../EntityFactory';
import { InMemoryAuthenticationRepository } from '../repositories';
import { AuthenticationInteractor } from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  let interactor: AuthenticationInteractor;
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManager;
  let passwordManager: PasswordManager;
  let factory: EntityFactory;

  beforeEach(() => {
    passwordManager = new PasswordManager('secret');
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new TokenManager('secret');
    interactor = new AuthenticationInteractor(repository, tokenManager, passwordManager);
    factory = new EntityFactory(repository, passwordManager);
  });

  describe('authenticate', () => {
    let tokenManager: TokenManagerStub;

    beforeEach(() => {
      tokenManager = new TokenManagerStub();
      interactor = new AuthenticationInteractor(repository, tokenManager, passwordManager);
    });

    it('returns null when no user exits', async () => {
      const email = 'user@example.com';
      const password = 'password';

      expect(await interactor.authenticate(email, password)).toBeNull();
    });

    it('returns null when user exists but the wrong password is provided', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password });

      expect(await interactor.authenticate(email, 'wrong password')).toBeNull();
    });

    it('returns the token when sucessful', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password });

      tokenManager.token = uuid();

      const response = await interactor.authenticate(email, password);

      expect(response).toEqual({ token: tokenManager.token });
    });
  });

  describe('getAuthenticatedUser', () => {
    it('returns null when invalid token is given', async () => {
      const token = 'invalid_token';
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toBeNull();
    });

    it('returns null when token is valid but user does not exist', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toBeNull();
    });

    it('returns null when token is expired', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId, 0);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toBeNull();
    });

    it('returns the user when token is valid', async () => {
      const user = await factory.createUser();

      const token = tokenManager.encode(user.id);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual(user);
    });
  });

  describe('registerUser', () => {
    it('returns validation errors when request is invalid', async () => {
      const request = { email: '', password: '' };
      const response = await interactor.registerUser(request);
      expect(response).toEqual({
        status: 'validation_error',
        validationErrors: [
          new ValidationError('email', 'required'),
          new ValidationError('password', 'required'),
        ],
      });
    });
  });

  describe('integration', () => {
    it('authenticates and gets authenticated user', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const user = await factory.createUser({ email, password });

      const tokenResponse = await interactor.authenticate(email, password);

      expect(await interactor.getAuthenticatedUser(tokenResponse!.token)).toEqual(user);
    });
  });
});

export class TokenManagerStub extends TokenManager {
  public token = 'token';

  constructor() {
    super('no_secret');
  }

  public encode(_userId: string): string {
    return this.token;
  }
}
