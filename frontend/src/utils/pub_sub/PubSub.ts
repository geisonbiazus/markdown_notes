import { Publisher } from './Publisher';

export type SubscriberCallback<T> = (payload: T) => void;
export type DisposeFn = () => void;

export class PubSub implements Publisher {
  private subscribers: Record<string, SubscriberCallback<unknown>[]> = {};

  public pusblish<T>(event: string, payload?: T): void {
    this.subscribersFor<T | undefined>(event).forEach((callback) => callback(payload));
  }

  public subscribe<T>(event: string, callback: SubscriberCallback<T>): DisposeFn {
    this.subscribersFor<T>(event).push(callback);
    return this.disposeCallback(event, callback);
  }

  private disposeCallback<T>(event: string, callback: SubscriberCallback<T>): DisposeFn {
    return () => {
      const subscribers = this.subscribersFor<T>(event);
      const index = subscribers.indexOf(callback);
      if (index >= 0) subscribers.splice(index, 1);
    };
  }

  private subscribersFor<T>(event: string): SubscriberCallback<T>[] {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    return this.subscribers[event];
  }
}
