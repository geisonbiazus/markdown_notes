export class Config {
  public get env(): string {
    return process.env.NODE_ENV || 'development';
  }

  public get port(): number {
    return parseInt(process.env.PORT || '4000');
  }

  public get authenticationTokenSecret(): string {
    return process.env.AUTHENTICATION_TOKEN_SECRET || 'token_secret';
  }

  public get authenticationPasswordSecret(): string {
    return process.env.AUTHENTICATION_PASSWORD_SECRET || 'password_secret';
  }
}
