import { uuid } from '../../utils';
import { PasswordManager } from './PasswordManager';

describe('PasswordManager', () => {
  const secret = uuid();
  const passwordManager = new PasswordManager(secret);

  it('hashes and verifies a password', async () => {
    const hashedPassword = await passwordManager.hashPassword('password', 'salt');

    expect(await passwordManager.verifyPassword(hashedPassword, 'password', 'salt')).toEqual(true);
  });

  it('fails on verifyng wrong password', async () => {
    const hashedPassword = await passwordManager.hashPassword('password', 'salt');

    expect(
      await passwordManager.verifyPassword(hashedPassword, 'invalid_password', 'salt')
    ).toEqual(false);
  });

  it('fails on verifyng correct password with wrong salt', async () => {
    const hashedPassword = await passwordManager.hashPassword('password', 'salt');

    expect(
      await passwordManager.verifyPassword(hashedPassword, 'password', 'invalid_salt')
    ).toEqual(false);
  });

  it('fails on verifyng correct password with correct salt but a different secret', async () => {
    const hashedPassword = await passwordManager.hashPassword('password', 'salt');

    const anotherPasswordManager = new PasswordManager('another secret');

    expect(await anotherPasswordManager.verifyPassword(hashedPassword, 'password', 'salt')).toEqual(
      false
    );
  });
});
