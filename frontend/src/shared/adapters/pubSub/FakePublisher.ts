import { Publisher } from '../../ports/pubSub';

export interface PublishedEvent {
  name: string;
  payload: any;
}

export class FakePublisher implements Publisher {
  public events: PublishedEvent[] = [];

  public get lastEvent(): PublishedEvent | undefined {
    return this.events[this.events.length - 1];
  }

  public publish<T>(event: string, payload?: T): void {
    this.events.push({ name: event, payload });
  }
}
