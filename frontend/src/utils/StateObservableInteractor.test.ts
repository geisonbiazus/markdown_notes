import { StateObservableInteractor, BooleanKey } from './StateObservableInteractor';

describe('StateObservableInteractor', () => {
  let interactor: TestInteractor;

  beforeEach(() => {
    interactor = new TestInteractor();
  });

  it('contains a state', () => {
    expect(interactor.state).toEqual(newTestState());
  });

  describe('updateState', () => {
    it('partially updates the state', () => {
      interactor.updateState({ key2: 'new value' });
      expect(interactor.state).toEqual({ ...newTestState(), key2: 'new value' });
    });
  });

  describe('withPendingState', () => {
    it('sets the given boolean as true before running the callback and reverts it after', async () => {
      let callbackCalled = false;
      await interactor.withPendingState('pending', async () => {
        expect(interactor.state.pending).toBeTruthy();
        callbackCalled = true;
      });
      expect(callbackCalled).toBeTruthy();
      expect(interactor.state.pending).toBeFalsy();
    });
  });

  describe('observe', () => {
    it('runs the given callback every time the state changes', () => {
      let observedState: TestState = newTestState();

      interactor.observe((state: TestState) => {
        observedState = state;
      });

      interactor.updateState({ key1: 'new key1 value' });
      expect(observedState).toEqual({ ...newTestState(), key1: 'new key1 value' });

      interactor.updateState({ key2: 'new key2 value' });
      expect(observedState).toEqual({
        ...newTestState(),
        key1: 'new key1 value',
        key2: 'new key2 value',
      });
    });

    it('supports multiple observers', () => {
      let observer1Called = false;
      let observer2Called = false;

      interactor.observe(() => {
        observer1Called = true;
      });

      interactor.observe(() => {
        observer2Called = true;
      });

      interactor.updateState({ key1: 'new key1 value' });

      expect(observer1Called).toBeTruthy();
      expect(observer2Called).toBeTruthy();
    });

    it('returns a dispose function that removes the observable', () => {
      let observer1TimesCalled = 0;
      let observer2TimesCalled = 0;

      const dispose = interactor.observe(() => {
        observer1TimesCalled++;
      });

      interactor.observe(() => {
        observer2TimesCalled++;
      });

      interactor.updateState({ key1: 'new key1 value' });

      dispose();

      interactor.updateState({ key2: 'new key2 value' });

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

class TestInteractor extends StateObservableInteractor<TestState> {
  constructor() {
    super(newTestState());
  }

  public updateState(update: Partial<TestState>): void {
    super.updateState(update);
  }

  public async withPendingState(
    field: BooleanKey<TestState>,
    callback: () => Promise<any>
  ): Promise<void> {
    return super.withPendingState(field, callback);
  }
}
