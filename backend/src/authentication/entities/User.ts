export type UserStatus = 'pending' | 'active';

export interface UserParams {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  status?: UserStatus;
}

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public status: UserStatus;

  constructor(params?: UserParams) {
    this.id = params?.id || '';
    this.name = params?.name || '';
    this.email = params?.email || '';
    this.password = params?.password || '';
    this.status = params?.status || 'pending';
  }

  public isPending(): boolean {
    return this.status == 'pending';
  }
}
