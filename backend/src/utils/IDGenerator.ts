import { uuid } from './uuid';

export interface IDGenerator {
  generate(): string;
}

export class UUIDGenerator implements IDGenerator {
  public generate(): string {
    return uuid();
  }
}

export class FakeIDGenerator implements IDGenerator {
  public nextId: string = uuid();

  generate(): string {
    return this.nextId;
  }
}
