import { sleep } from '../../utils/sleep';
import { PubSub } from './PubSub';

describe('PubSub', () => {
  it('sends the published events to the subscriber', () => {
    const pubSub = new PubSub();
    let receivedEvent = '';

    pubSub.subscribe('event_name', () => (receivedEvent = 'event_name'));

    pubSub.publish('event_name');

    expect(receivedEvent).toEqual('event_name');
  });

  it('sends events to multiple subscribers', () => {
    const pubSub = new PubSub();
    let subscriber1Event = '';
    let subscriber2Event = '';

    pubSub.subscribe('event_name', () => (subscriber1Event = 'event_name'));
    pubSub.subscribe('event_name', () => (subscriber2Event = 'event_name'));

    pubSub.publish('event_name');

    expect(subscriber1Event).toEqual('event_name');
    expect(subscriber2Event).toEqual('event_name');
  });

  it('only sends events of the type the subscriber is interested', () => {
    const pubSub = new PubSub();
    let subscriber1Event = '';
    let subscriber2Event = '';
    let subscriber3Event = '';

    pubSub.subscribe('event_2', () => (subscriber1Event = 'event_2'));
    pubSub.subscribe('event_2', () => (subscriber2Event = 'event_2'));
    pubSub.subscribe('event_1', () => (subscriber3Event = 'event_1'));

    pubSub.publish('event_1');
    pubSub.publish('event_2');
    pubSub.publish('event_3');

    expect(subscriber1Event).toEqual('event_2');
    expect(subscriber2Event).toEqual('event_2');
    expect(subscriber3Event).toEqual('event_1');
  });

  it('optionally send typed payload', () => {
    const pubSub = new PubSub();
    let receivedPayload: EventPayload;

    pubSub.subscribe('event_name', (payload: EventPayload) => {
      receivedPayload = payload;
    });

    const sentPayload: EventPayload = { key1: 'val1', key2: 'val2' };

    pubSub.publish('event_name', sentPayload);

    expect(receivedPayload!).toEqual(sentPayload);
  });

  it('accepts async callbacks but does not wait for execution', () => {
    const pubSub = new PubSub();
    let receivedEvent = '';
    let callbackFinished = false;

    pubSub.subscribe('event_name', async () => {
      receivedEvent = 'event_name';
      await sleep(1);
      callbackFinished = true;
    });

    pubSub.publish('event_name');

    expect(receivedEvent).toEqual('event_name');
    expect(callbackFinished).toBeFalsy();
  });

  it('returns a dispose function that removes the subscriber when called', () => {
    const pubSub = new PubSub();
    const events1: string[] = [];
    const events2: string[] = [];
    const events3: string[] = [];
    const events4: string[] = [];
    const events5: string[] = [];

    pubSub.subscribe('event', () => events1.push('event'));
    const dispose2 = pubSub.subscribe('event', () => events2.push('event'));
    pubSub.subscribe('event', () => events3.push('event'));
    const dispose4 = pubSub.subscribe('event', () => events4.push('event'));
    const dispose5 = pubSub.subscribe('event', () => events5.push('event'));

    pubSub.publish('event');

    dispose2();

    pubSub.publish('event');

    dispose4();
    dispose5();

    pubSub.publish('event');

    expect(events1.length).toEqual(3);
    expect(events2.length).toEqual(1);
    expect(events3.length).toEqual(3);
    expect(events4.length).toEqual(2);
    expect(events5.length).toEqual(2);
  });

  it('ignores if callback is disposed twice', () => {
    const pubSub = new PubSub();
    const events1: string[] = [];
    const events2: string[] = [];

    const dispose = pubSub.subscribe('event', () => events1.push('event'));
    pubSub.subscribe('event', () => events2.push('event'));

    pubSub.publish('event');

    dispose();
    dispose();

    pubSub.publish('event');

    expect(events1.length).toEqual(1);
    expect(events2.length).toEqual(2);
  });
});

interface EventPayload {
  key1: string;
  key2: string;
}
