import { uuid } from '../../utils';
import { TokenManager } from './TokenManager';

describe('TokenManager', () => {
  it('generates a token for the given user id', () => {
    const tokenManager = new TokenManager('secret');
    const userId = uuid();

    const token = tokenManager.encode(userId);

    expect(token).not.toEqual('');

    const decodedUserId = tokenManager.decode(token);

    expect(decodedUserId).toEqual(userId);
  });

  it('fails on decoding expired token', () => {
    const tokenManager = new TokenManager('secret');
    const userId = uuid();
    const expiresIn = 0;

    const token = tokenManager.encode(userId, expiresIn);

    expect(() => tokenManager.decode(token)).toThrow(Error('Token expired'));
  });

  it('fails on decoding with a different secret', () => {
    const tokenManager = new TokenManager('secret');
    const userId = uuid();
    const token = tokenManager.encode(userId);

    const invalidTokenManager = new TokenManager('invalid_secret');

    expect(() => invalidTokenManager.decode(token)).toThrow(Error('Invalid token'));
  });
});
