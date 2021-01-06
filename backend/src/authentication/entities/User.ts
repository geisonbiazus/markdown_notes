export interface UserParams {
  id?: string;
  email?: string;
  password?: string;
}

export class User {
  public id: string;
  public email: string;
  public password: string;

  constructor(params?: UserParams) {
    this.id = params?.id || '';
    this.email = params?.email || '';
    this.password = params?.password || '';
  }
}
