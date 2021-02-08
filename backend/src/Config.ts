import dotenv from 'dotenv';

export class Config {
  constructor() {
    dotenv.config();
  }

  public get env(): string {
    return process.env.NODE_ENV || 'development';
  }

  public get port(): number {
    return parseInt(process.env.PORT || '4000');
  }

  public get authenticationTokenSecret(): string {
    return process.env.AUTHENTICATION_TOKEN_SECRET || 'token_secret';
  }

  public get authenticationPasswordSecret(): string {
    return process.env.AUTHENTICATION_PASSWORD_SECRET || 'password_secret';
  }

  public get defaultEmailSender(): string {
    return process.env.DEFAULT_EMAIL_SENDER || '';
  }

  public get sendgridApiKey(): string {
    return process.env.SENDGRID_API_KEY || '';
  }

  public get sendgridUserActivationTemplateId(): string {
    return process.env.SENDGRID_USER_ACTIVATION_TEMPLATE_ID || '';
  }

  public get frontendAppURL(): string {
    return process.env.FRONTEND_APP_URL || 'http://localhost:3000';
  }

  public get rabbitmqURL(): string {
    return process.env.RABBITMQ_URL || 'amqp://localhost';
  }

  public get rabbitmqExchange(): string {
    return process.env.RABBITMQ_EXCHANGE || 'markdown_notes';
  }
}
