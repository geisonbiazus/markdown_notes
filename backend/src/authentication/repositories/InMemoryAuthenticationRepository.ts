import { User } from '../entities/User';
import { AuthenticationRepository } from '../ports/AuthenticationRepository';

export class InMemoryAuthenticationRepository implements AuthenticationRepository {
  private users: Record<string, User> = {};

  async saveUser(user: User): Promise<void> {
    this.users[user.id] = user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Object.values(this.users).find((user) => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users[id] || null;
  }
}
