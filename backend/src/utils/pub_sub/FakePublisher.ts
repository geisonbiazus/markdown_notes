import { AnyEvent, Publisher } from './PubSub';

export class FakePublisher implements Publisher {
  public events: AnyEvent[] = [];

  public async publish<TEvent extends AnyEvent>(event: TEvent): Promise<void> {
    this.events.push(event);
  }

  public get lastPublishedEvent(): AnyEvent | null {
    return this.events[this.events.length - 1] || null;
  }
}
