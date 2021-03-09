export interface TokenManager {
  encode(userId: string): string;
  encode(userId: string, expiresIn: number): string;
  decode(token: string): string;
}
