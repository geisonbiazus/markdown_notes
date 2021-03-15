export interface PasswordManager {
  hashPassword(password: string, salt: string): Promise<string>;
  verifyPassword(hashedPassword: string, password: string, salt: string): Promise<boolean>;
}
