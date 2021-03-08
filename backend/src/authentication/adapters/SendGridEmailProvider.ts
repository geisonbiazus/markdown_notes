import sgMail from '@sendgrid/mail';
import { Email, EmailType } from '../entities/Email';
import { EmailProvider } from '../ports/EmailProvider';

export interface TemplateIdsMap {
  userActivation: string;
}
export class SendGridEmailProvider implements EmailProvider {
  constructor(
    private apiKey: string,
    private senderEmail: string,
    private templateIdsMap: TemplateIdsMap
  ) {}

  public async send(email: Email): Promise<void> {
    sgMail.setApiKey(this.apiKey);
    await sgMail.send({
      to: email.recipient,
      from: this.senderEmail,
      templateId: this.templateIdForType(email.type),
      dynamicTemplateData: email.variables,
    });
  }

  public templateIdForType(type: EmailType): string {
    switch (type) {
      case EmailType.USER_ACTIVATION:
        return this.templateIdsMap.userActivation;
      default:
        throw 'Template type not mapped';
    }
  }
}
