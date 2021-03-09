import { uuid } from '../../utils/uuid';
import { PasswordManager } from '../entities/PasswordManager';
import { TokenManager } from '../entities/TokenManager';
import { EntityFactory } from '../EntityFactory';
import { InMemoryAuthenticationRepository } from '../adapters/repositories/InMemoryAuthenticationRepository';
import { AuthenticateUseCase } from './AuthenticateUseCase';

describe('AuthenticateUseCase', () => {
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;
  let passwordManager: PasswordManager;
  let factory: EntityFactory;
  let useCase: AuthenticateUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new TokenManagerStub();
    passwordManager = new PasswordManager('secret');
    factory = new EntityFactory(repository, passwordManager);
    useCase = new AuthenticateUseCase(repository, tokenManager, passwordManager);
  });

  describe('run', () => {
    it('returns not_found error when no user exits', async () => {
      const email = 'user@example.com';
      const password = 'password';

      expect(await useCase.run(email, password)).toEqual({
        status: 'error',
        type: 'not_found',
      });
    });

    it('returns not_found when user exists but the wrong password is provided', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password });

      expect(await useCase.run(email, 'wrong password')).toEqual({
        status: 'error',
        type: 'not_found',
      });
    });

    it('returns pending_user error when user is pending', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password, status: 'pending' });

      tokenManager.token = uuid();

      const response = await useCase.run(email, password);

      expect(response).toEqual({ status: 'error', type: 'pending_user' });
    });

    it('returns the token when successful', async () => {
      const email = 'user@example.com';
      const password = 'password';
      await factory.createUser({ email, password, status: 'active' });

      tokenManager.token = uuid();

      const response = await useCase.run(email, password);

      expect(response).toEqual({ status: 'success', token: tokenManager.token });
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
