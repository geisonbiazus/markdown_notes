import { Email } from '../entities';
import { EmailProvider } from '../interactors';

export class SendGridEmailProvider implements EmailProvider {
  public async send(email: Email): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
