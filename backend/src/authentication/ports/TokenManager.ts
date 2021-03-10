export interface TokenManager {
  encode(userId: string): string;
  encode(userId: string, expiresIn: number): string;
  decode(token: string): string;
}

export class TokenExpiredError extends Error {
  constructor(public cause: Error) {
    super('Token expired');
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class InvalidTokenError extends Error {
  constructor(public cause: Error) {
    super('Invalid token');
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}
