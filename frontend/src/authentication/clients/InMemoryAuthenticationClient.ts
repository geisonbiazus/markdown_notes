import { AuthenticationClient, Token } from '../entities';

interface User {
  email: string;
  password: string;
  token: string;
}

export class InMemoryAuthenticationClient implements AuthenticationClient {
  private users: User[] = [];

  public async signIn(email: string, password: string): Promise<Token | null> {
    const user = this.users.find((user) => user.email === email && user.password === password);
    return user?.token || null;
  }

  public addUser(email: string, password: string, token: string): void {
    this.users.push({ email, password, token });
  }
}
