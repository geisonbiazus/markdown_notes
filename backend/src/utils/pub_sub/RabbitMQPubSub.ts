import { Event, Publisher, Subscriber } from './PubSub';
import amqp from 'amqplib';

interface ConsumerInfo {
  queue: string;
  consumerTag: string;
}

export class RabbitMQPubSub implements Publisher, Subscriber {
  private conn?: amqp.Connection;
  public consumers: ConsumerInfo[] = [];

  constructor(public exchangeName: string) {}

  public get connection(): amqp.Connection {
    if (!this.conn) throw new Error('Not connected to RabbitMQ');
    return this.conn;
  }

  public async connect(): Promise<void> {
    this.conn = await amqp.connect('amqp://localhost');
  }

  public async disconnect(): Promise<void> {
    await this.conn?.close();
  }

  public async cleanUp(): Promise<void> {
    const channel = await this.connection.createChannel();

    for (const consumer of this.consumers) {
      await channel.cancel(consumer.consumerTag);
      await channel.deleteQueue(consumer.queue);
      await channel.deleteExchange(this.exchangeName);
    }
  }

  public async publish<TEvent extends Event<string, any>>(event: TEvent): Promise<void> {
    const channel = await this.connection.createChannel();

    await channel.assertExchange(this.exchangeName, 'direct', { durable: true });

    channel.publish(
      this.exchangeName,
      event.name,
      Buffer.from(Buffer.from(JSON.stringify(event))),
      {
        persistent: true,
      }
    );
  }

  async subscribe<TEvent extends Event<string, any>>(
    subscriberId: string,
    eventName: TEvent['name'],
    callback: (payload: TEvent['payload']) => void | Promise<void>
  ): Promise<void> {
    const channel = await this.connection.createChannel();

    const queueName = await this.createQueueForSubscriber(subscriberId, eventName, channel);

    const consume = await channel.consume(queueName, (msg: amqp.ConsumeMessage | null) => {
      if (msg?.content) {
        const event = JSON.parse(msg.content.toString()) as TEvent;

        if (event.name === eventName) {
          callback(event.payload);
        }

        channel.ack(msg);
      }
    });

    this.consumers.push({ queue: queueName, consumerTag: consume.consumerTag });
  }

  public async createQueueForSubscriber(
    subscriberId: string,
    eventName: string,
    channel?: amqp.Channel
  ): Promise<string> {
    if (!channel) {
      channel = await this.connection.createChannel();
    }

    await channel.assertExchange(this.exchangeName, 'direct', { durable: true });

    const queueName = `${subscriberId}_${eventName}`;

    const queue = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, this.exchangeName, eventName);

    return queue.queue;
  }
}
