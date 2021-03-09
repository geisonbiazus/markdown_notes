import { uuid } from '../../utils/uuid';
import { FakeEmailProvider } from '../adapters/emailProviders/FakeEmailProvider';
import { Email, EmailType } from '../entities/Email';
import { PasswordManager } from '../entities/PasswordManager';
import { TokenManager } from '../entities/TokenManager';
import { EntityFactory } from '../EntityFactory';
import { UserNotFoundError } from '../errors';
import { InMemoryAuthenticationRepository } from '../repositories/InMemoryAuthenticationRepository';
import { NotifyUserActivationUseCase } from './NotifyUserActivationUseCase';

describe('AuthenticationInteractor', () => {
  const frontendURL = 'http://example.com';

  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManagerStub;
  let emailProvider: FakeEmailProvider;
  let passwordManager: PasswordManager;
  let factory: EntityFactory;
  let useCase: NotifyUserActivationUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new TokenManagerStub();
    emailProvider = new FakeEmailProvider();
    passwordManager = new PasswordManager('secret');
    factory = new EntityFactory(repository, passwordManager);
    useCase = new NotifyUserActivationUseCase(repository, tokenManager, frontendURL, emailProvider);
  });

  describe('run', () => {
    it('reises error if user does not exit', async () => {
      let errorThrown = false;

      try {
        await useCase.run(uuid());
      } catch (e) {
        if (e instanceof UserNotFoundError) {
          errorThrown = true;
        }
      }

      expect(errorThrown).toBeTruthy();
    });

    it('sends the activation email to the user', async () => {
      const user = await factory.createUser({ status: 'pending' });
      const token = 'activation_token';
      const activateUserUrl = `${frontendURL}/activate/${token}`;

      tokenManager.token = token;

      await useCase.run(user.id);

      expect(emailProvider.lastEmail).toEqual(
        new Email({
          type: EmailType.USER_ACTIVATION,
          recipient: user.email,
          variables: {
            FULL_NAME: user.name,
            ACTIVATE_USER_URL: activateUserUrl,
          },
        })
      );
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
