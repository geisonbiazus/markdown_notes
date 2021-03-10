import { Subscriber } from '../utils/pub_sub';
import { AuthenticationFacade } from './AuthenticationFacade';
import { UserCreatedEvent } from './events/UserCreatedEvent';

export async function startSubscribers(
  subscriber: Subscriber,
  facade: AuthenticationFacade
): Promise<void> {
  await subscriber.subscribe<UserCreatedEvent>('authentication', 'user_created', (payload) => {
    facade.notifyUserActivation(payload.id);
  });
}
