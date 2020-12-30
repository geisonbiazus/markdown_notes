import { ValidationError } from '../../utils/validations';
import { SaveNoteRequest } from '../interactors';

export class SaveNoteValidator {
  public errors: ValidationError[] = [];

  constructor(public request: SaveNoteRequest) {}

  isValid(): boolean {
    this.validateRequired('id');
    this.validateRequired('title');

    return this.errors.length == 0;
  }

  private validateRequired(field: keyof SaveNoteRequest): void {
    if (!this.request[field] || this.request[field] === '') {
      this.errors.push(new ValidationError(field, 'required'));
    }
  }
}
