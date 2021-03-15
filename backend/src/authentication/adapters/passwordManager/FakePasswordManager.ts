import { PasswordManager } from '../../ports/PasswordManager';

export class FakePasswordManager implements PasswordManager {
  public async hashPassword(password: string, salt: string): Promise<string> {
    return `hashed-${password}-${salt}`;
  }

  public async verifyPassword(
    hashedPassword: string,
    password: string,
    salt: string
  ): Promise<boolean> {
    const splittedHash = hashedPassword.split('-');
    return splittedHash[1] === password && splittedHash[2] === salt;
  }
}
