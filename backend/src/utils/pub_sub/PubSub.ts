export interface Event<TName, TPayload> {
  name: TName;
  payload: TPayload;
}

export interface Publisher {
  publish<TEvent extends Event<string, any>>(event: TEvent): Promise<void>;
}

export interface Subscriber {
  subscribe<TEvent extends Event<string, any>>(
    eventName: TEvent['name'],
    callback: (payload: TEvent['payload']) => Promise<void> | void
  );
}

interface UserRegisteredPayload {
  email: string;
}

class UserRegistered implements Event<'UserRegistered', UserRegisteredPayload> {
  name: 'UserRegistered';
  payload: UserRegisteredPayload;

  constructor(payload: UserRegisteredPayload) {
    this.name = 'UserRegistered';
    this.payload = payload;
  }
}

class Sub implements Subscriber {
  subscribe<TEvent extends Event<string, any>>(
    eventName: TEvent['name'],
    callback: (payload: TEvent['payload']) => void | Promise<void>
  ) {
    throw new Error('Method not implemented.');
  }
}

class Pub implements Publisher {
  publish<TEvent extends Event<string, any>>(event: TEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

const p = new Pub();
const s = new Sub();

p.publish(new UserRegistered({ email: '' }));
s.subscribe<UserRegistered>('UserRegistered', (payload: UserRegisteredPayload) => {
  payload.email;
});
