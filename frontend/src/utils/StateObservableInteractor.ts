export abstract class StateObservableInteractor<T> {
  private currentState: T;
  private observers: Observer<T>[] = [];

  constructor(initialState: T) {
    this.currentState = initialState;
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

  protected async withPendingState(
    field: BooleanKey<T>,
    callback: () => Promise<any>
  ): Promise<void> {
    this.updateState({ [field]: true } as any);
    await callback();
    this.updateState({ [field]: false } as any);
  }
}

export type Observer<T> = (state: T) => void;
export type DisposeObserverFn = () => void;

export type BooleanKey<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];
