import { Email } from '../entities';
import { EmailProvider } from '../interactors';

export class FakeEmailProvider implements EmailProvider {
  public lastEmail?: Email;

  public async send(email: Email): Promise<void> {
    this.lastEmail = email;
  }
}
