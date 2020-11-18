import { ValidationError } from '../../utils/interactor';
import { SaveNoteRequest } from '../interactors';

export class SaveNoteValidator {
  public id: string;
  public title: string;
  public body: string;
  public errors: ValidationError[] = [];

  constructor({ id = '', title = '', body = '' }: SaveNoteRequest) {
    this.id = id;
    this.title = title;
    this.body = body;
  }

  isValid(): boolean {
    this.validateRequired('id');
    this.validateRequired('title');

    return this.errors.length == 0;
  }

  private validateRequired(field: keyof SaveNoteRequest): void {
    if (this[field] === '') {
      this.errors.push(new ValidationError(field, 'required'));
    }
  }
}
