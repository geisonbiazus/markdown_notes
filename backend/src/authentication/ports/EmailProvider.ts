import { Email } from '../entities/Email';

export interface EmailProvider {
  send(email: Email): Promise<void>;
}
