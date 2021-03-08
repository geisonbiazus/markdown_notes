import { uuid } from '../utils';
import { PasswordManager } from './entities/PasswordManager';
import { UserParams, User } from './entities/User';
import { AuthenticationRepository } from './ports/AuthenticationRepository';

export class EntityFactory {
  constructor(
    public repository: AuthenticationRepository,
    public passwordManager: PasswordManager
  ) {}

  public async createUser(params: UserParams = {}): Promise<User> {
    const userParams: UserParams = {
      id: uuid(),
      name: 'User Name',
      email: 'user@exmaple.com',
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
