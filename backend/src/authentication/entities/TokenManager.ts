import jwt from 'jsonwebtoken';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

interface DecodedClaims {
  userId?: string;
}

export class TokenManager {
  constructor(private secret: string) {}

  public encode(userId: string, expiresIn: number = ONE_DAY_IN_SECONDS): string {
    const token = jwt.sign({ userId }, this.secret, { expiresIn });

    return token;
  }

  public decode(token: string): string {
    try {
      const claims = jwt.verify(token, this.secret) as DecodedClaims;
      return claims.userId!;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError(e);
      }
      if (e instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenError(e);
      }
      throw e;
    }
  }
}

export class TokenExpiredError extends Error {
  constructor(public cause: Error) {
    super('Token expired');
  }
}

export class InvalidTokenError extends Error {
  constructor(public cause: Error) {
    super('Invalid token');
  }
}
