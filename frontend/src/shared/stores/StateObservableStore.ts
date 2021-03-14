import { bind } from 'bind-decorator';

export abstract class StateObservableStore<T> {
  private initialState: T;
  private currentState: T;
  private observers: Observer<T>[] = [];

  constructor(initialState: T) {
    this.initialState = initialState;
    this.currentState = initialState;
  }

  @bind
  public cleanUp(): void {
    this.updateState(this.initialState);
  }

  public get state(): T {
    return this.currentState;
  }

  public observe(callback: Observer<T>): DisposeObserverFn {
    this.observers.push(callback);
    return this.disposeCallback(callback);
  }

  private disposeCallback(callback: Observer<T>): DisposeObserverFn {
    return () => {
      const index = this.observers.indexOf(callback);
      if (index >= 0) this.observers.splice(index, 1);
    };
  }

  protected updateState(update: Partial<T>): void {
    const updatedState = { ...this.state, ...update };
    this.currentState = updatedState;
    this.observers.forEach((observer) => observer(updatedState));
  }

  protected async withPendingState<TReturn>(
    field: BooleanKey<T>,
    callback: () => Promise<TReturn>
  ): Promise<TReturn> {
    this.updateState({ [field]: true } as any);
    const result = await callback();
    this.updateState({ [field]: false } as any);
    return result;
  }
}

export type Observer<T> = (state: T) => void;
export type DisposeObserverFn = () => void;

export type BooleanKey<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];
