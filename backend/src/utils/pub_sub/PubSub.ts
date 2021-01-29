export abstract class Event<TName, TPayload> {
  constructor(public name: TName, public payload: TPayload) {}
}

export interface Publisher {
  publish<TEvent extends Event<string, any>>(event: TEvent): Promise<void>;
}

export interface Subscriber {
  subscribe<TEvent extends Event<string, any>>(
    eventName: TEvent['name'],
    callback: (payload: TEvent['payload']) => Promise<void> | void
  ): Promise<void>;
}
