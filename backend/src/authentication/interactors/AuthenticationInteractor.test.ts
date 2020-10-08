import { uuid } from '../../utils';
import { PasswordManager, User } from '../entities';
import { InMemoryAuthenticationRepository } from '../repositories';
import { AuthenticationInteractor } from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  let interactor: AuthenticationInteractor;
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;
  let passwordManager: PasswordManager;

  beforeEach(() => {
    passwordManager = new PasswordManager();
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

    it.only('Given a user exists but the wrong password is provided, it returns error', async () => {
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
});

export class TokenManagerStub {
  public token = 'token';

  public generateToken(_userId: string): string {
    return this.token;
  }
}
