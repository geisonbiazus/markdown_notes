export interface StateManager<T> {
  setState(state: T): void;
  getState(): T;
}

export class StateBasedInteractor<T> {
  constructor(private stateManager: StateManager<T>) {}

  protected get state(): T {
    return this.stateManager.getState();
  }

  protected updateState(update: Partial<T>): void {
    this.stateManager.setState({ ...this.state, ...update });
  }
}

export class InMemoryStateManager<T> implements StateManager<T> {
  constructor(private state: T) {}

  setState(state: T): void {
    this.state = state;
  }

  getState(): T {
    return this.state;
  }
}
