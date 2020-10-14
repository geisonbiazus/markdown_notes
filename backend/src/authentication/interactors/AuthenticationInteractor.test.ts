import { uuid } from '../../utils';
import { PasswordManager, TokenManager, User } from '../entities';
import { InMemoryAuthenticationRepository } from '../repositories';
import { AuthenticationInteractor } from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  let interactor: AuthenticationInteractor;
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;
  let passwordManager: PasswordManager;

  beforeEach(() => {
    passwordManager = new PasswordManager('secret');
    tokenManager = new TokenManagerStub();
    repository = new InMemoryAuthenticationRepository();
    interactor = new AuthenticationInteractor(repository, tokenManager, passwordManager);
  });

  describe('authenticate', () => {
    it('Given no user exists for the email, it returns error', async () => {
      const email = 'user@example.com';
      const password = 'password';

      const response = await interactor.authenticate(email, password);

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists but the wrong password is provided, it returns error', async () => {
      const hashedPassword = await passwordManager.hashPassword('password', 'user@example.com');
      const user = new User({ id: uuid(), email: 'user@example.com', password: hashedPassword });
      await repository.saveUser(user);

      const response = await interactor.authenticate(user.email, 'wrong password');

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists and the correct password is provided, it returns the user token', async () => {
      const hashedPassword = await passwordManager.hashPassword('password', 'user@example.com');
      const user = new User({ id: uuid(), email: 'user@example.com', password: hashedPassword });
      await repository.saveUser(user);

      tokenManager.token = uuid();

      const response = await interactor.authenticate(user.email, 'password');

      expect(response).toEqual({ status: 'success', data: { token: tokenManager.token } });
    });
  });

  describe('getAuthenticatedUser', () => {
    let tokenManager: TokenManager;

    beforeEach(() => {
      tokenManager = new TokenManager('secret');
      interactor = new AuthenticationInteractor(repository, tokenManager, passwordManager);
    });

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
      const user = new User({ id: uuid(), email: 'user@example.com' });

      repository.saveUser(user);

      const token = tokenManager.encode(user.id);
      const response = await interactor.getAuthenticatedUser(token);

      expect(response).toEqual({ status: 'success', data: user });
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
