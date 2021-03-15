import { AuthenticationContext } from './AuthenticationContext';
import { UserCreatedEvent } from './events/UserCreatedEvent';

export async function startSubscribers(context: AuthenticationContext): Promise<void> {
  await context.subscriber.subscribe<UserCreatedEvent>(
    'authentication',
    'user_created',
    (payload) => {
      context.notifyUserActivationUseCase.run(payload.id);
    }
  );
}
