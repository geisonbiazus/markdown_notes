import bcrypt from 'bcrypt';

export class PasswordManager {
  constructor(public secret: string) {}

  public async hashPassword(password: string, salt: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password + salt + this.secret, saltRounds);

    return hashedPassword;
  }

  public async verifyPassword(
    hashedPassword: string,
    password: string,
    salt: string
  ): Promise<boolean> {
    return await bcrypt.compare(password + salt + this.secret, hashedPassword);
  }
}
