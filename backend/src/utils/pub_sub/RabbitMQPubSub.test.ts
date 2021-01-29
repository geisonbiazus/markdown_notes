import { sleep } from '../sleep';
import { Event } from './PubSub';
import { RabbitMQPubSub } from './RabbitMQPubSub';

describe('RabbitMQPubSub', () => {
  let pubSub: RabbitMQPubSub;

  beforeEach(async () => {
    pubSub = new RabbitMQPubSub();
    await pubSub.connect();
  });

  afterEach(async () => {
    await sleep(200); // We need to wait to give time for the client to send ack and publish commands to RabbitMQ
    await pubSub.disconnect();
  });

  it('publishes and subscribes to an event', async () => {
    let receivedPayload: TestEventPayload | undefined;

    const waitForConsuming = new Promise((resolve) => {
      pubSub.subscribe<TestEvent>('test_event', (payload: TestEventPayload) => {
        receivedPayload = payload;
        resolve(undefined);
      });
    });

    await pubSub.publish(new TestEvent({ key: 'value' }));
    await waitForConsuming;

    expect(receivedPayload).toEqual({ key: 'value' });
  });
});

interface TestEventPayload {
  key: string;
}

class TestEvent extends Event<'test_event', TestEventPayload> {
  constructor(public payload: TestEventPayload) {
    super('test_event', payload);
  }
}
