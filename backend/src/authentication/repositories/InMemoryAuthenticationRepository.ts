import { User } from '../entities';

export class InMemoryAuthenticationRepository {
  private users: Record<string, User> = {};

  async saveUser(user: User): Promise<void> {
    this.users[user.id] = user;
  }
}
