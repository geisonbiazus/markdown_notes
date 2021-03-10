import { uuid } from '../../../utils/uuid';
import { IDGenerator } from '../../ports/IDGenerator';

export class UUIDGenerator implements IDGenerator {
  public generate(): string {
    return uuid();
  }
}
