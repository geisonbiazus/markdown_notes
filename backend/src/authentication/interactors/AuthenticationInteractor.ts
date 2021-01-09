import { IDGenerator } from '../../utils/IDGenerator';
import { validationErrorResponse, ValidationErrorResponse } from '../../utils/validations';
import {
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
    private idGenerator: IDGenerator
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

    const user = await this.createNewUser(request.email, request.password);

    return { status: 'success', user };
  }

  private async isEmailAvailable(email: string): Promise<boolean> {
    return (await this.repository.getUserByEmail(email)) === null;
  }

  private async createNewUser(email: string, password: string): Promise<User> {
    const user = new User({
      id: this.idGenerator.generate(),
      email: email,
      password: await this.passwordManager.hashPassword(password, email),
      status: 'pending',
    });

    await this.repository.saveUser(user);

    return user;
  }
}

export interface AuthenticationRepository {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
}

export interface AuthenticateResponse {
  token: string;
}

export interface RegisterUserRequest {
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
