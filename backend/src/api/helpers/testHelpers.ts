import { AppContext } from '../../AppContext';
import { User } from '../../authentication';

export async function createUser(context: AppContext): Promise<User> {
  return await context.authentication.entityFactory.createUser();
}

export function authenticate(context: AppContext, user: User): string {
  return context.authentication.tokenManager.encode(user.id);
}
