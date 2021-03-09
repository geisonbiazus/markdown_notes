import { uuid } from '../../utils/uuid';
import { BcryptPasswordManager } from '../adapters/passwordManager/BcryptPasswordManager';
import { JWTTokenManager } from '../adapters/tokenManager/JWTTokenManager';
import { EntityFactory } from '../EntityFactory';
import { InMemoryAuthenticationRepository } from '../adapters/repositories/InMemoryAuthenticationRepository';
import { GetAuthenticatedUserUseCase } from './GetAuthenticatedUserUseCase';

describe('GetAuthenticatedUserUseCase', () => {
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: JWTTokenManager;
  let passwordManager: BcryptPasswordManager;
  let factory: EntityFactory;
  let useCase: GetAuthenticatedUserUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new JWTTokenManager('secret');
    passwordManager = new BcryptPasswordManager('secret');
    factory = new EntityFactory(repository, passwordManager);
    useCase = new GetAuthenticatedUserUseCase(repository, tokenManager);
  });

  describe('run', () => {
    it('returns null when invalid token is given', async () => {
      const token = 'invalid_token';
      const response = await useCase.run(token);

      expect(response).toBeNull();
    });

    it('returns null when token is valid but user does not exist', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId);
      const response = await useCase.run(token);

      expect(response).toBeNull();
    });

    it('returns null when token is expired', async () => {
      const userId = uuid();
      const token = tokenManager.encode(userId, 0);
      const response = await useCase.run(token);

      expect(response).toBeNull();
    });

    it('returns the user when token is valid', async () => {
      const user = await factory.createUser();

      const token = tokenManager.encode(user.id);
      const response = await useCase.run(token);

      expect(response).toEqual(user);
    });
  });
});
