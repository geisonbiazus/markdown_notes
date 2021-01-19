export enum EmailType {
  USER_ACTIVATION = 'USER_ACTIVATION',
}

export interface EmailParams {
  type: EmailType;
  recipient: string;
  variables?: Record<string, string>;
}
export class Email {
  type: EmailType;
  recipient: string;
  variables: Record<string, string>;

  constructor(params: EmailParams) {
    this.type = params.type;
    this.recipient = params.recipient;
    this.variables = params.variables || {};
  }
}
