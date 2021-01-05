import { BaseValidator, ValidationError } from '../../utils/validations';
import { SaveNoteRequest } from '../interactors';

export class SaveNoteValidator extends BaseValidator<SaveNoteRequest> {
  protected validate(): void {
    this.validateRequired('id');
    this.validateRequired('title');
  }
}
