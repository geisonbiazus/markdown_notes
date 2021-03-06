import { FakeIDGenerator } from '../../shared/adapters/idGenerator/FakeIDGenerator';
import { ValidationError } from '../../shared/entities/ValidationError';
import { FakePublisher } from '../../shared/adapters/pubSub/FakePublisher';
import { uuid } from '../../shared/utils/uuid';
import { FakePasswordManager } from '../adapters/passwordManager/FakePasswordManager';
import { InMemoryAuthenticationRepository } from '../adapters/repositories/InMemoryAuthenticationRepository';
import { User } from '../entities/User';
import { UserCreatedEvent } from '../events/UserCreatedEvent';
import { PasswordManager } from '../ports/PasswordManager';
import { RegisterUserSuccessResponse, RegisterUserUseCase } from './RegisterUserUseCase';

describe('RegisterUserUseCase', () => {
  let repository: InMemoryAuthenticationRepository;
  let passwordManager: FakePasswordManager;
  let idGenerator: FakeIDGenerator;
  let publisher: FakePublisher;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    repository = new InMemoryAuthenticationRepository();
    passwordManager = new FakePasswordManager();
    idGenerator = new FakeIDGenerator();
    publisher = new FakePublisher();
    useCase = new RegisterUserUseCase(repository, passwordManager, idGenerator, publisher);
  });

  describe('run', () => {
    it('returns validation errors when request is invalid', async () => {
      const request = { name: '', email: '', password: '' };
      const response = await useCase.run(request);

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

      const response = await useCase.run(request);

      expect(response).toEqual({
        status: 'error',
        type: 'email_not_available',
      });
    });

    it('creates and returns the user', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };
      const response = await useCase.run(request);

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
      const response = await useCase.run(request);

      expect(response.status).toEqual('success');
      const { user } = response as RegisterUserSuccessResponse;

      if (response.status == 'success') {
        expect(await repository.getUserById(response.user.id)).toEqual(user);
      }
    });

    it('publishes UserCreatedEvent', async () => {
      const request = { name: 'User Name', email: 'user@example.com', password: 'password123' };
      const response = await useCase.run(request);

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
});
