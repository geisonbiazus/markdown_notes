import { uuid } from '../../utils';
import { User } from '../entities';
import { InMemoryAuthenticationRepository } from '../repositories';
import { AuthenticationInteractor } from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  let interactor: AuthenticationInteractor;
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;

  beforeEach(() => {
    tokenManager = new TokenManagerStub();
    repository = new InMemoryAuthenticationRepository();
    interactor = new AuthenticationInteractor(repository, tokenManager);
  });

  describe('authenticate', () => {
    it('Given no user exists for the email, it returns error', async () => {
      const email = 'user@example.com';
      const password = 'password';

      const response = await interactor.authenticate(email, password);

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists but the wrong password is provided, it returns error', async () => {
      const user = new User({ id: uuid(), email: 'user@example.com', password: 'password' });
      await repository.saveUser(user);

      const response = await interactor.authenticate(user.email, 'wrong password');

      expect(response).toEqual({ status: 'error', type: 'not_found' });
    });

    it('Given a user exists and the correct password is provided, it returns the user token', async () => {
      const user = new User({ id: uuid(), email: 'user@example.com', password: 'password' });
      await repository.saveUser(user);

      const token = tokenManager.token;
      const response = await interactor.authenticate(user.email, user.password);

      expect(response).toEqual({ status: 'success', data: { token } });
    });
  });
});

export class TokenManagerStub {
  public token = 'token';

  public generateToken(_userId: string): string {
    return this.token;
  }
}
