import { AppContext } from '../../AppContext';
import { User, AuthenticationFactory } from '../../authentication';

export async function createUser(context: AppContext): Promise<User> {
  const factory = new AuthenticationFactory(
    context.authenticationRepository,
    context.passwordManager
  );
  return await factory.createUser();
}

export function authenticate(context: AppContext, user: User): string {
  return context.tokenManager.encode(user.id);
}
