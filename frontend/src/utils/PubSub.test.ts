import { PubSub } from './PubSub';
import { sleep } from './sleep';

describe('PubSub', () => {
  it('sends the published events to the subscriber', () => {
    const pubSub = new PubSub();
    let receivedEvent = '';

    pubSub.subscribe('event_name', (event: string) => (receivedEvent = event));

    pubSub.pusblish('event_name');

    expect(receivedEvent).toEqual('event_name');
  });

  it('sends events to multiple subscribers', () => {
    const pubSub = new PubSub();
    let subscriber1Event = '';
    let subscriber2Event = '';

    pubSub.subscribe('event_name', (event: string) => (subscriber1Event = event));
    pubSub.subscribe('event_name', (event: string) => (subscriber2Event = event));

    pubSub.pusblish('event_name');

    expect(subscriber1Event).toEqual('event_name');
    expect(subscriber2Event).toEqual('event_name');
  });

  it('only sends events of the type the subscriber is interested', () => {
    const pubSub = new PubSub();
    let subscriber1Event = '';
    let subscriber2Event = '';
    let subscriber3Event = '';

    pubSub.subscribe('event_2', (event: string) => (subscriber1Event = event));
    pubSub.subscribe('event_2', (event: string) => (subscriber2Event = event));
    pubSub.subscribe('event_1', (event: string) => (subscriber3Event = event));

    pubSub.pusblish('event_1');
    pubSub.pusblish('event_2');
    pubSub.pusblish('event_3');

    expect(subscriber1Event).toEqual('event_2');
    expect(subscriber2Event).toEqual('event_2');
    expect(subscriber3Event).toEqual('event_1');
  });

  it('optionally send typed payload', () => {
    const pubSub = new PubSub();
    let receivedEvent = '';
    let receivedPayload: EventPayload;

    pubSub.subscribe('event_name', (event: string, payload: EventPayload) => {
      receivedEvent = event;
      receivedPayload = payload;
    });

    const sentPayload: EventPayload = { key1: 'val1', key2: 'val2' };

    pubSub.pusblish('event_name', sentPayload);

    expect(receivedEvent).toEqual('event_name');
    expect(receivedPayload!).toEqual(sentPayload);
  });

  it('accepts async callbacks but does not wait for execution', () => {
    const pubSub = new PubSub();
    let receivedEvent = '';
    let callbackFinished = false;

    pubSub.subscribe('event_name', async (event: string) => {
      receivedEvent = event;
      await sleep(1);
      callbackFinished = true;
    });

    pubSub.pusblish('event_name');

    expect(receivedEvent).toEqual('event_name');
    expect(callbackFinished).toBeFalsy();
  });
});

interface EventPayload {
  key1: string;
  key2: string;
}
