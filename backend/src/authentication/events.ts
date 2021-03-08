import { Event } from '../utils/pub_sub';
import { UserStatus } from './entities/User';

export interface UserCreatedEventPayload {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}

export class UserCreatedEvent extends Event<'user_created', UserCreatedEventPayload> {
  constructor(payload: UserCreatedEventPayload) {
    super('user_created', payload);
  }
}
