import { User } from '../entities';
import { AuthenticationRepository } from '../interactors';

export class InMemoryAuthenticationRepository implements AuthenticationRepository {
  private users: Record<string, User> = {};

  async saveUser(user: User): Promise<void> {
    this.users[user.id] = user;
  }

  getUserByEmail(email: string): User | null {
    return Object.values(this.users).find((user) => user.email === email) || null;
  }
}
