import { uuid } from '../utils';
import { PasswordManager, User, UserParams } from './entities';
import { AuthenticationRepository } from './interactors';

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
