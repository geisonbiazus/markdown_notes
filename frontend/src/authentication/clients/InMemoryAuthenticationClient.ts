import {
  ActivateUserResponse,
  AuthenticationClient,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../entities';

interface User {
  name: string;
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

  public async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const user = this.users.find((user) => user.email === request.email);

    if (user) return { status: 'error', type: 'email_not_available' };

    this.users.push({ ...request, token: 'token', status: 'pending' });
    return { status: 'success' };
  }

  public async activateUser(token: String): Promise<ActivateUserResponse> {
    const user = this.users.find((user) => user.token == token);

    if (!user) return { status: 'error', type: 'not_found' };

    user.status = 'active';
    return { status: 'success' };
  }

  public addActiveUser(name: string, email: string, password: string, token: string): void {
    this.users.push({ name, email, password, token, status: 'active' });
  }

  public addPendingUser(name: string, email: string, password: string, token: string): void {
    this.users.push({ name, email, password, token, status: 'pending' });
  }

  public get lastUser(): User {
    return this.users[this.users.length - 1];
  }
}
