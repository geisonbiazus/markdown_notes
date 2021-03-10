import { uuid } from '../utils/uuid';
import { User, UserParams } from './entities/User';
import { AuthenticationRepository } from './ports/AuthenticationRepository';
import { PasswordManager } from './ports/PasswordManager';

export class EntityFactory {
  constructor(
    public repository: AuthenticationRepository,
    public passwordManager: PasswordManager
  ) {}

  public async createUser(params: UserParams = {}): Promise<User> {
    const userParams: UserParams = {
      id: uuid(),
      name: 'User Name',
      email: 'user@example.com',
      password: 'password',
      status: 'active',
      ...params,
    };

    userParams.password = await this.passwordManager.hashPassword(
      userParams.password!,
      userParams.email!
    );

    const user = new User(userParams);

    await this.repository.saveUser(user);

    return user;
  }
}
