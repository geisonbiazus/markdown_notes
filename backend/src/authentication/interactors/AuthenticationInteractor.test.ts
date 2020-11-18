import { uuid } from '../../utils';
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

    it('Given no user exists for the email, it returns error', async () => {
      const email = 'user@example.com';
      const password = 'password';

      const response = await interactor.authenticate(email, password);

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists but the wrong password is provided, it returns error', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password });

      const response = await interactor.authenticate(email, 'wrong password');

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists and the correct password is provided, it returns the user token', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password });

      tokenManager.token = uuid();

      const response = await interactor.authenticate(email, password);

      expect(response).toEqual({ status: 'success', data: { token: tokenManager.token } });
    });
  });

  describe('getAuthenticatedUser', () => {
    it('returns error when invalid token is given', async () => {
      const token = 'invalid_token';
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual({ status: 'error', type: 'invalid_token' });
    });

    it('returns error when token is valid but user does not exist', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('returns error when token is expired', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId, 0);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual({ status: 'error', type: 'token_expired' });
    });

    it('returns the user when token is valid', async () => {
      const user = await factory.createUser();

      const token = tokenManager.encode(user.id);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual({ status: 'success', data: user });
    });
  });

  describe('integration', () => {
    it('authenticates and gets authenticated user', async () => {
      const email = 'user@example.com';
      const password = 'password';
      const user = await factory.createUser({ email, password });

      const tokenResponse = await interactor.authenticate(email, password);
      const userResponse = await interactor.getAuthenticatedUser(tokenResponse.data!.token);

      expect(userResponse.data).toEqual(user);
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
