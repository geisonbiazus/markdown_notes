import { uuid } from '../../utils/uuid';
import { BcryptPasswordManager } from '../adapters/passwordManager/BcryptPasswordManager';
import { InMemoryAuthenticationRepository } from '../adapters/repositories/InMemoryAuthenticationRepository';
import { EntityFactory } from '../EntityFactory';
import { AuthenticateUseCase } from './AuthenticateUseCase';
import { TokenManagerStub } from './testDoubles';

describe('AuthenticateUseCase', () => {
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;
  let passwordManager: BcryptPasswordManager;
  let factory: EntityFactory;
  let useCase: AuthenticateUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new TokenManagerStub();
    passwordManager = new BcryptPasswordManager('secret');
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
