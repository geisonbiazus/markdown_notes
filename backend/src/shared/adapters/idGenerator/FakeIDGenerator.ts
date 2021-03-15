import { uuid } from '../../utils/uuid';
import { IDGenerator } from '../../ports/IDGenerator';

export class FakeIDGenerator implements IDGenerator {
  public nextId: string = uuid();

  generate(): string {
    return this.nextId;
  }
}
