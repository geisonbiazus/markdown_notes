import { AuthenticationClient, SignInResponse, Token } from '../entities';

interface User {
  email: string;
  password: string;
  token: string;
  status: 'active' | 'pending';
}

export class InMemoryAuthenticationClient implements AuthenticationClient {
  private users: User[] = [];

  public async signIn(email: string, password: string): Promise<SignInResponse> {
    const user = this.users.find((user) => user.email === email && user.password === password);

    if (!user) {
      return { status: 'error', type: 'not_found' };
    }

    if (user.status === 'pending') {
      return { status: 'error', type: 'pending_user' };
    }

    return { status: 'success', token: user.token };
  }

  public addActiveUser(email: string, password: string, token: string): void {
    this.users.push({ email, password, token, status: 'active' });
  }

  public addPendingUser(email: string, password: string, token: string): void {
    this.users.push({ email, password, token, status: 'pending' });
  }
}
