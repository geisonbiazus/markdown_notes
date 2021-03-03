import { BaseValidator, ValidationError } from '../../utils/validations';
import { SaveNoteRequest } from '../useCases/SaveNoteUseCase';

export class SaveNoteValidator extends BaseValidator<SaveNoteRequest> {
  protected validate(): void {
    this.validateRequired('id');
    this.validateRequired('title');
  }
}
