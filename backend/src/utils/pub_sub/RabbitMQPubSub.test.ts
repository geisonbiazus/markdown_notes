import { sleep } from '../sleep';
import { AnyEvent, Event, Name, Payload } from './PubSub';
import { RabbitMQPubSub } from './RabbitMQPubSub';

describe('RabbitMQPubSub', () => {
  let pubSub: RabbitMQPubSub;

  beforeEach(async () => {
    pubSub = new RabbitMQPubSub('test_exchange');
    await pubSub.connect();
  });

  afterEach(async () => {
    await sleep(200); // Give time for the client to send ack and publish commands to RabbitMQ
    await pubSub.cleanUp();
    await pubSub.disconnect();
  });

  it('publishes and subscribes to an event', async () => {
    await pubSub.createQueueForSubscriber('subscriber_1', 'test_event');
    await pubSub.publish(new TestEvent({ key: 'value 1' }));

    const receivedPayload = await subscribeAndWaitForPayload<TestEvent>(
      'subscriber_1',
      'test_event'
    );

    expect(receivedPayload).toEqual({ key: 'value 1' });
  });

  it('it allows more than one subscriber per event', async () => {
    await pubSub.createQueueForSubscriber('subscriber_1', 'test_event');
    await pubSub.createQueueForSubscriber('subscriber_2', 'test_event');

    await pubSub.publish(new TestEvent({ key: 'value 2' }));

    const receivedPayload1 = await subscribeAndWaitForPayload<TestEvent>(
      'subscriber_1',
      'test_event'
    );

    const receivedPayload2 = await subscribeAndWaitForPayload<TestEvent>(
      'subscriber_2',
      'test_event'
    );

    expect(receivedPayload1).toEqual({ key: 'value 2' });
    expect(receivedPayload2).toEqual({ key: 'value 2' });
  });

  it('consumes only the event it is subscribed for', async () => {
    await pubSub.createQueueForSubscriber('subscriber_1', 'test_event');
    await pubSub.createQueueForSubscriber('subscriber_2', 'test_event_2');

    await pubSub.publish(new TestEvent({ key: 'value' }));
    await pubSub.publish(new TestEvent2({ key2: 'value' }));

    const receivedPayload1 = await subscribeAndWaitForPayload<TestEvent>(
      'subscriber_1',
      'test_event'
    );

    const receivedPayload2 = await subscribeAndWaitForPayload<TestEvent2>(
      'subscriber_2',
      'test_event_2'
    );

    expect(receivedPayload1).toEqual({ key: 'value' });
    expect(receivedPayload2).toEqual({ key2: 'value' });
  });

  async function subscribeAndWaitForPayload<TEvent extends AnyEvent>(
    subscriberId: string,
    eventName: Name<TEvent>
  ): Promise<Payload<TEvent>> {
    return new Promise<Payload<TEvent>>((resolve) => {
      pubSub.subscribe<TEvent>(subscriberId, eventName, (payload: TestEventPayload) => {
        resolve(payload);
      });
    });
  }
});

interface TestEventPayload {
  key: string;
}

class TestEvent extends Event<'test_event', TestEventPayload> {
  constructor(public payload: TestEventPayload) {
    super('test_event', payload);
  }
}

interface TestEvent2Payload {
  key2: string;
}

class TestEvent2 extends Event<'test_event_2', TestEvent2Payload> {
  constructor(public payload: TestEvent2Payload) {
    super('test_event_2', payload);
  }
}
