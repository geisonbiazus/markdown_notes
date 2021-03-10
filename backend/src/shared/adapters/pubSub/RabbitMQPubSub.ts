import { AnyEvent, Name, Publisher, Subscriber, SubscriberCallback } from '../../ports/PubSub';
import { Event } from '../../entities/Event';
import amqp from 'amqplib';

interface ConsumerInfo {
  queue: string;
  consumerTag: string;
}

export class RabbitMQPubSub implements Publisher, Subscriber {
  private conn?: amqp.Connection;
  private publishChan?: amqp.Channel;

  public consumers: ConsumerInfo[] = [];

  constructor(public url: string, public exchangeName: string) {}

  public get connection(): amqp.Connection {
    if (!this.conn) throw new Error('Not connected to RabbitMQ');
    return this.conn;
  }

  public async connect(): Promise<void> {
    this.conn = await amqp.connect(this.url);
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

  public async publish<TEvent extends AnyEvent>(event: TEvent): Promise<void> {
    const channel = await this.publishChannel();
    await this.assertExchange(channel);
    channel.publish(this.exchangeName, event.name, this.serialize(event), { persistent: true });
  }

  private async publishChannel(): Promise<amqp.Channel> {
    if (!this.publishChan) {
      this.publishChan = await this.connection.createChannel();
    }
    return this.publishChan;
  }

  private serialize<T>(event: T): Buffer {
    return Buffer.from(JSON.stringify(event));
  }

  async subscribe<TEvent extends AnyEvent>(
    subscriberId: string,
    eventName: Name<TEvent>,
    callback: SubscriberCallback<TEvent>
  ): Promise<void> {
    const channel = await this.createChannel();
    const queueName = await this.createQueueForSubscriber(subscriberId, eventName, channel);
    const consume = await channel.consume(
      queueName,
      this.consumeCallback(channel, eventName, callback)
    );
    this.consumers.push({ queue: queueName, consumerTag: consume.consumerTag });
  }

  private async createChannel(): Promise<amqp.Channel> {
    return await this.connection.createChannel();
  }

  public async createQueueForSubscriber(
    subscriberId: string,
    eventName: string,
    channel?: amqp.Channel
  ): Promise<string> {
    if (!channel) channel = await this.createChannel();
    await this.assertExchange(channel);

    const queueName = `${subscriberId}_${eventName}`;
    const queue = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, this.exchangeName, eventName);

    return queue.queue;
  }

  public consumeCallback<TEvent extends AnyEvent>(
    channel: amqp.Channel,
    eventName: Name<TEvent>,
    callback: SubscriberCallback<TEvent>
  ): (msg: amqp.ConsumeMessage | null) => void {
    return (msg: amqp.ConsumeMessage | null) => {
      if (msg?.content) {
        try {
          const event = JSON.parse(msg.content.toString()) as TEvent;

          if (event.name === eventName) {
            callback(event.payload);
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'test') {
            console.log(e);
            console.log(msg);
            console.log(msg.content.toString());
          }
        }
        channel.ack(msg);
      }
    };
  }

  private async assertExchange(channel: amqp.Channel): Promise<void> {
    await channel.assertExchange(this.exchangeName, 'direct', { durable: true });
  }
}
