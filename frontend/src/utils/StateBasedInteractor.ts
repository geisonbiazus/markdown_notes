export class StateManager<T> {
  constructor(private state: T, private stateObserverFn?: (state: T) => void) {}

  setState(state: T): void {
    this.state = state;
    this.stateObserverFn?.(state);
  }

  getState(): T {
    return this.state;
  }
}

type BooleanKey<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export class StateBasedInteractor<T> {
  constructor(private stateManager: StateManager<T>) {}

  protected get state(): T {
    return this.stateManager.getState();
  }

  protected updateState(update: Partial<T>): void {
    this.stateManager.setState({ ...this.state, ...update });
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
