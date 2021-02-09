import { userInfo } from 'os';
import { uuid } from '../../utils';
import { FakeIDGenerator } from '../../utils/IDGenerator';
import { FakePublisher } from '../../utils/pub_sub';
import { ValidationError } from '../../utils/validations';
import { FakeEmailProvider } from '../adapters';
import { Email, EmailType, PasswordManager, TokenManager, User } from '../entities';
import { EntityFactory } from '../EntityFactory';
import { UserCreatedEvent } from '../events';
import { InMemoryAuthenticationRepository } from '../repositories';
import {
  AuthenticationInteractor,
  RegisterUserSuccessResponse,
  UserNotFoundError,
} from './AuthenticationInteractor';

describe('AuthenticationInteractor', () => {
  let interactor: AuthenticationInteractor;
  let repository: InMemoryAuthenticationRepository;
  let tokenManager: TokenManager;
  let passwordManager: PasswordManager;
  let idGenerator: FakeIDGenerator;
  let factory: EntityFactory;
  let emailProvider: FakeEmailProvider;
  let publisher: FakePublisher;
  const frontendURL = 'http://example.com';

  beforeEach(() => {
    passwordManager = new PasswordManager('secret');
    repository = new InMemoryAuthenticationRepository();
    tokenManager = new TokenManager('secret');
    idGenerator = new FakeIDGenerator();
    emailProvider = new FakeEmailProvider();
    publisher = new FakePublisher();
    interactor = new AuthenticationInteractor(
      repository,
      tokenManager,
      passwordManager,
      idGenerator,
      frontendURL,
      emailProvider,
      publisher
    );
    factory = new EntityFactory(repository, passwordManager);
  });

  describe('authenticate', () => {
    let tokenManager: TokenManagerStub;

    beforeEach(() => {
      tokenManager = new TokenManagerStub();
      interactor = new AuthenticationInteractor(
        repository,
        tokenManager,
        passwordManager,
        idGenerator,
        frontendURL,
        emailProvider,
        publisher
      );
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
    let passwordManager: FakePasswordManager;

    beforeEach(() => {
      passwordManager = new FakePasswordManager('nothing');
      interactor = new AuthenticationInteractor(
        repository,
        tokenManager,
        passwordManager,
        idGenerator,
        frontendURL,
        emailProvider,
        publisher
      );
    });

    it('returns validation errors when request is invalid', async () => {
      const request = { name: '', email: '', password: '' };
      const response = await interactor.registerUser(request);

      expect(response).toEqual({
        status: 'validation_error',
        validationErrors: [
          new ValidationError('name', 'required'),
          new ValidationError('email', 'required'),
          new ValidationError('password', 'required'),
        ],
      });
    });

    it('returns error when another user with the same email exists', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };

      repository.saveUser(new User({ id: uuid(), email: request.email, password: 'any' }));

      const response = await interactor.registerUser(request);

      expect(response).toEqual({
        status: 'error',
        type: 'email_not_available',
      });
    });

    it('creates and returns the user', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };
      const response = await interactor.registerUser(request);

      expect(response.status).toEqual('success');

      const { user } = response as RegisterUserSuccessResponse;

      expect(user.id).toEqual(idGenerator.nextId);
      expect(user.name).toEqual('User Name');
      expect(user.email).toEqual('user@example.com');
      expect(user.password).toEqual(
        await passwordManager.hashPassword(request.password, request.email)
      );
      expect(user.status).toEqual('pending');
    });

    it('persists the new user', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };
      const response = await interactor.registerUser(request);

      expect(response.status).toEqual('success');
      const { user } = response as RegisterUserSuccessResponse;

      if (response.status == 'success') {
        expect(await repository.getUserById(response.user.id)).toEqual(user);
      }
    });

    it('publishes UserCreatedEvent', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };
      const response = await interactor.registerUser(request);

      const { user } = response as RegisterUserSuccessResponse;

      const event = new UserCreatedEvent({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      });

      expect(publisher.lastPublishedEvent).toEqual(event);
    });
  });

  describe('activateUser', () => {
    it('returns false when token is invalid', async () => {
      expect(await interactor.activateUser('invalid token')).toBeFalsy();
    });

    it('activates the user when token is valid', async () => {
      const user = await factory.createUser({ status: 'pending' });
      const token = tokenManager.encode(user.id);

      expect(await interactor.activateUser(token)).toBeTruthy();

      const activatedUser = await repository.getUserById(user.id);
      expect(activatedUser!.status).toEqual('active');
    });

    it('returns false when user does not exist', async () => {
      const token = tokenManager.encode(uuid());
      expect(await interactor.activateUser(token)).toBeFalsy();
    });

    it('returns false when token is expired', async () => {
      const user = await factory.createUser({ status: 'pending' });
      const token = tokenManager.encode(user.id, 0);

      expect(await interactor.activateUser(token)).toBeFalsy();
    });

    it('returns false when user is already active', async () => {
      const user = await factory.createUser({ status: 'active' });
      const token = tokenManager.encode(user.id);

      expect(await interactor.activateUser(token)).toBeFalsy();
    });
  });

  describe('notifyUserActivation', () => {
    let tokenManager: TokenManagerStub;

    beforeEach(() => {
      tokenManager = new TokenManagerStub();
      interactor = new AuthenticationInteractor(
        repository,
        tokenManager,
        passwordManager,
        idGenerator,
        frontendURL,
        emailProvider,
        publisher
      );
    });

    it('reises error if user does not exit', async () => {
      let errorThrown = false;

      try {
        await interactor.notifyUserActivation(uuid());
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

      await interactor.notifyUserActivation(user.id);

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

export class FakePasswordManager extends PasswordManager {
  public async hashPassword(password: string, salt: string): Promise<string> {
    return `hashed-${password}-${salt}`;
  }
}
