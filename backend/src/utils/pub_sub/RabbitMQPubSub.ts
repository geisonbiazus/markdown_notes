import { Event, Publisher, Subscriber } from './PubSub';
import amqp from 'amqplib';

export class RabbitMQPubSub implements Publisher, Subscriber {
  private conn?: amqp.Connection;
  public consumers: amqp.Replies.Consume[] = [];

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

  public async publish<TEvent extends Event<string, any>>(event: TEvent): Promise<void> {
    const exchange = 'test_exchange';
    const channel = await this.connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    channel.publish(exchange, '', Buffer.from(Buffer.from(JSON.stringify(event))), {
      persistent: true,
    });
  }

  async subscribe<TEvent extends Event<string, any>>(
    eventName: TEvent['name'],
    callback: (payload: TEvent['payload']) => void | Promise<void>
  ): Promise<void> {
    const exchange = 'test_exchange';
    const channel = await this.connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    const queueName = 'test_queue';
    const queue = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchange, '');

    this.consumers.push(
      await channel.consume(queue.queue, (msg: amqp.ConsumeMessage | null) => {
        if (msg?.content) {
          console.log(' [x] %s', msg.content.toString());
          const event = JSON.parse(msg.content.toString()) as TEvent;
          callback(event.payload);
          channel.ack(msg);
        }
      })
    );
  }
}
