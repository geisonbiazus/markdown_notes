import { Event } from '../entities/Event';

export type AnyEvent = Event<string, any>;
export type Name<TEvent extends Event<string, any>> = TEvent['name'];
export type Payload<TEvent extends Event<string, any>> = TEvent['payload'];
export type SubscriberCallback<TEvent extends AnyEvent> = (
  payload: Payload<TEvent>
) => Promise<void> | void;

export interface Publisher {
  publish<TEvent extends AnyEvent>(event: TEvent): Promise<void>;
}

export interface Subscriber {
  subscribe<TEvent extends AnyEvent>(
    subscriberId: string,
    eventName: Name<TEvent>,
    callback: SubscriberCallback<TEvent>
  ): Promise<void>;
}
