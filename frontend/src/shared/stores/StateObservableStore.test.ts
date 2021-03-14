import { StateObservableStore, BooleanKey } from './StateObservableStore';

describe('StateObservableStore', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('contains a state', () => {
    expect(store.state).toEqual(newTestState());
  });

  describe('updateState', () => {
    it('partially updates the state', () => {
      store.updateState({ key2: 'new value' });
      expect(store.state).toEqual({ ...newTestState(), key2: 'new value' });
    });
  });

  describe('withPendingState', () => {
    it('sets the given boolean as true before running the callback and reverts it after', async () => {
      let callbackCalled = false;
      const result = await store.withPendingState('pending', async () => {
        expect(store.state.pending).toBeTruthy();
        callbackCalled = true;
        return 5;
      });
      expect(callbackCalled).toBeTruthy();
      expect(store.state.pending).toBeFalsy();
      expect(result).toEqual(5);
    });
  });

  describe('observe', () => {
    it('runs the given callback every time the state changes', () => {
      let observedState: TestState = newTestState();

      store.observe((state: TestState) => {
        observedState = state;
      });

      store.updateState({ key1: 'new key1 value' });
      expect(observedState).toEqual({ ...newTestState(), key1: 'new key1 value' });

      store.updateState({ key2: 'new key2 value' });
      expect(observedState).toEqual({
        ...newTestState(),
        key1: 'new key1 value',
        key2: 'new key2 value',
      });
    });

    it('supports multiple observers', () => {
      let observer1Called = false;
      let observer2Called = false;

      store.observe(() => {
        observer1Called = true;
      });

      store.observe(() => {
        observer2Called = true;
      });

      store.updateState({ key1: 'new key1 value' });

      expect(observer1Called).toBeTruthy();
      expect(observer2Called).toBeTruthy();
    });

    it('returns a dispose function that removes the observable', () => {
      let observer1TimesCalled = 0;
      let observer2TimesCalled = 0;

      const dispose1 = store.observe(() => {
        observer1TimesCalled++;
      });

      const dispose2 = store.observe(() => {
        observer2TimesCalled++;
      });

      store.updateState({ key1: 'new key1 value' });

      dispose1();

      store.updateState({ key2: 'new key2 value' });

      dispose2();

      store.updateState({ key2: 'another key2 value' });

      expect(observer1TimesCalled).toEqual(1);
      expect(observer2TimesCalled).toEqual(2);
    });
  });
});

interface TestState {
  key1: string;
  key2: string;
  pending: boolean;
}

function newTestState(): TestState {
  return { key1: 'value 1', key2: 'value 2', pending: false };
}

class TestStore extends StateObservableStore<TestState> {
  constructor() {
    super(newTestState());
  }

  public updateState(update: Partial<TestState>): void {
    super.updateState(update);
  }

  public async withPendingState<TReturn>(
    field: BooleanKey<TestState>,
    callback: () => Promise<TReturn>
  ): Promise<TReturn> {
    return super.withPendingState(field, callback);
  }
}
