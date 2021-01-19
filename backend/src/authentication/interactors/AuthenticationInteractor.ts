import { IDGenerator } from '../../utils/IDGenerator';
import { validationErrorResponse, ValidationErrorResponse } from '../../utils/validations';
import {
  Email,
  EmailType,
  InvalidTokenError,
  PasswordManager,
  TokenExpiredError,
  TokenManager,
  User,
} from '../entities';
import { RegisterUserValidator } from '../validators/RegisterUserValidator';

export class AuthenticationInteractor {
  constructor(
    private repository: AuthenticationRepository,
    private tokenManager: TokenManager,
    private passwordManager: PasswordManager,
    private idGenerator: IDGenerator,
    private frontendURL: string,
    private emailProvider: EmailProvider
  ) {}

  public async authenticate(email: string, password: string): Promise<AuthenticateResponse | null> {
    const user = await this.repository.getUserByEmail(email);

    if (!user) return null;
    if (!(await this.verifyPassword(user, password))) return null;

    return { token: this.tokenManager.encode(user.id) };
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return await this.passwordManager.verifyPassword(user.password, password, user.email);
  }

  public async getAuthenticatedUser(token: string): Promise<User | null> {
    try {
      const userId = this.tokenManager.decode(token);
      return await this.repository.getUserById(userId);
    } catch (e) {
      if (e instanceof InvalidTokenError) return null;
      if (e instanceof TokenExpiredError) return null;
      throw e;
    }
  }

  public async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const validator = new RegisterUserValidator(request);

    if (!validator.isValid()) {
      return validationErrorResponse(validator.errors);
    }

    if (!(await this.isEmailAvailable(request.email))) {
      return errorResponse('email_not_available');
    }

    const user = await this.createNewUser(request);

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

  public async activateUser(token: string): Promise<boolean> {
    const user = await this.getUserFromToken(token);

    if (!user) return false;

    return await this.activatePendingUser(user);
  }

  private async getUserFromToken(token: string): Promise<User | null> {
    const userId = this.getUserIdFromToken(token);

    if (!userId) return null;

    return await this.repository.getUserById(userId);
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      return this.tokenManager.decode(token);
    } catch (e) {
      if (e instanceof InvalidTokenError) return null;
      if (e instanceof TokenExpiredError) return null;
      throw e;
    }
  }

  private async activatePendingUser(user: User): Promise<boolean> {
    if (!user.isPending()) return false;

    user.status = 'active';
    await this.repository.saveUser(user);

    return true;
  }

  public async notifyUserActivation(userId: string): Promise<void> {
    const user = await this.repository.getUserById(userId);

    if (!user) throw new UserNotFoundError();

    const token = this.tokenManager.encode(userId);
    const activateUserUrl = `${this.frontendURL}/activate/${token}`;

    const email = new Email({
      type: EmailType.USER_ACTIVATION,
      recipient: user.email,
      variables: {
        FULL_NAME: user.name,
        ACTIVATE_USER_URL: activateUserUrl,
      },
    });

    this.emailProvider.send(email);
  }
}

export interface AuthenticationRepository {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
}

export interface EmailProvider {
  send(email: Email): Promise<void>;
}

export interface AuthenticateResponse {
  token: string;
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

export interface ErrorResponse {
  status: 'error';
  type: string;
}

export function errorResponse(type: string): ErrorResponse {
  return { status: 'error', type };
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
