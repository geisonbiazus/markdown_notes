import { errorResponse, ErrorResponse } from '../../utils/ErrorResponse';
import { IDGenerator } from '../../utils/IDGenerator';
import { Publisher } from '../../utils/pub_sub/PubSub';
import { validationErrorResponse, ValidationErrorResponse } from '../../utils/validations';
import { User } from '../entities/User';
import { UserCreatedEvent } from '../events';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';
import { PasswordManager } from '../ports/PasswordManager';
import { RegisterUserValidator } from './validators/RegisterUserValidator';

export class RegisterUserUseCase {
  constructor(
    private repository: AuthenticationRepository,
    private passwordManager: PasswordManager,
    private idGenerator: IDGenerator,
    private publisher: Publisher
  ) {}

  public async run(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const validator = new RegisterUserValidator(request);

    if (!validator.isValid()) {
      return validationErrorResponse(validator.errors);
    }

    if (!(await this.isEmailAvailable(request.email))) {
      return errorResponse('email_not_available');
    }

    const user = await this.createNewUser(request);
    await this.publishUserCreatedEvent(user);

    return { status: 'success', user };
  }

  private async isEmailAvailable(email: string): Promise<boolean> {
    return (await this.repository.getUserByEmail(email)) === null;
  }

  private async createNewUser(request: RegisterUserRequest): Promise<User> {
    const user = new User({
      id: this.idGenerator.generate(),
      name: request.name,
      email: request.email,
      password: await this.passwordManager.hashPassword(request.password, request.email),
      status: 'pending',
    });

    await this.repository.saveUser(user);

    return user;
  }

  private async publishUserCreatedEvent(user: User): Promise<void> {
    await this.publisher.publish(
      new UserCreatedEvent({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      })
    );
  }
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export type RegisterUserResponse =
  | RegisterUserSuccessResponse
  | ValidationErrorResponse
  | ErrorResponse;

export interface RegisterUserSuccessResponse {
  status: 'success';
  user: User;
}
