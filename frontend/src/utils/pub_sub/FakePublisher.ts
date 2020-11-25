import { Publisher } from './Publisher';

export interface PublishedEvent {
  name: string;
  payload: any;
}

export class FakePublisher implements Publisher {
  public events: PublishedEvent[] = [];

  public pusblish<T>(event: string, payload?: T): void {
    this.events.push({ name: event, payload });
  }
}
