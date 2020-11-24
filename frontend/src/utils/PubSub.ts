export type SubscriberCallback<T> = (event: string, payload: T) => void;

export interface Event {}

export class PubSub {
  subscribers: Record<string, SubscriberCallback<unknown>[]> = {};

  public pusblish<T>(event: string, payload?: T) {
    this.subscribersFor<T | undefined>(event).forEach((callback) => callback(event, payload));
  }

  public subscribe<T>(event: string, callback: SubscriberCallback<T>) {
    this.subscribersFor<T>(event).push(callback);
  }

  private subscribersFor<T>(event: string): SubscriberCallback<T>[] {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    return this.subscribers[event];
  }
}
