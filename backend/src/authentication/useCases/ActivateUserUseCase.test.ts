import { uuid } from '../../utils/uuid';
import { BcryptPasswordManager } from '../adapters/passwordManager/BcryptPasswordManager';
import { JWTTokenManager } from '../adapters/tokenManager/JWTTokenManager';
import { EntityFactory } from '../EntityFactory';
import { InMemoryAuthenticationRepository } from '../adapters/repositories/InMemoryAuthenticationRepository';
import { ActivateUserUseCase } from './ActivateUserUseCase';

describe('ActivateUserUseCase', () => {
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: JWTTokenManager;
  let passwordManager: BcryptPasswordManager;
  let factory: EntityFactory;
  let useCase: ActivateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new JWTTokenManager('secret');
    passwordManager = new BcryptPasswordManager('secret');
    factory = new EntityFactory(repository, passwordManager);
    useCase = new ActivateUserUseCase(repository, tokenManager);
  });

  describe('run', () => {
    it('returns false when token is invalid', async () => {
      expect(await useCase.run('invalid token')).toBeFalsy();
    });

    it('activates the user when token is valid', async () => {
      const user = await factory.createUser({ status: 'pending' });
      const token = tokenManager.encode(user.id);

      expect(await useCase.run(token)).toBeTruthy();

      const activatedUser = await repository.getUserById(user.id);
      expect(activatedUser!.status).toEqual('active');
    });

    it('returns false when user does not exist', async () => {
      const token = tokenManager.encode(uuid());
      expect(await useCase.run(token)).toBeFalsy();
    });

    it('returns false when token is expired', async () => {
      const user = await factory.createUser({ status: 'pending' });
      const token = tokenManager.encode(user.id, 0);

      expect(await useCase.run(token)).toBeFalsy();
    });

    it('returns false when user is already active', async () => {
      const user = await factory.createUser({ status: 'active' });
      const token = tokenManager.encode(user.id);

      expect(await useCase.run(token)).toBeFalsy();
    });
  });
});
