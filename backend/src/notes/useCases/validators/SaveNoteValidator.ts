import { BaseValidator } from '../../../utils/validations';
import { SaveNoteRequest } from '../SaveNoteUseCase';

export class SaveNoteValidator extends BaseValidator<SaveNoteRequest> {
  protected validate(): void {
    this.validateRequired('id');
    this.validateRequired('title');
  }
}
