import { Email, EmailType } from '../entities/Email';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';
import { EmailProvider } from '../ports/EmailProvider';
import { TokenManager } from '../ports/TokenManager';

export class NotifyUserActivationUseCase {
  constructor(
    private repository: AuthenticationRepository,
    private tokenManager: TokenManager,
    private frontendURL: string,
    private emailProvider: EmailProvider
  ) {}

  public async run(userId: string): Promise<void> {
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

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
