import { Email } from '../../entities/Email';
import { EmailProvider } from '../../ports/EmailProvider';

export class FakeEmailProvider implements EmailProvider {
  public lastEmail?: Email;

  public async send(email: Email): Promise<void> {
    this.lastEmail = email;
  }
}
