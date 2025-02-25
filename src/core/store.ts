import { deepEqual } from '../utils/utils';

type Listener<T> = (state: T, previousState: T) => void;
export type Middleware<T> = (
  store: Store<T>,
) => (next: (state: T) => void) => (state: T) => void;

/**
 * Store interface
 */
export interface Store<T> {
  /** Returns the current state */
  getState: () => T;
  /** Returns the initial state that was used to create the store */
  getInitialState: () => T;
  /** Returns the previous state before the last update */
  getPreviousState: () => T;
  /** Updates the state using the provided function */
  setState: (fn: (state: T) => T) => void;
  /**
   * Subscribes to state changes
   * @param listener Function called when state changes with new and previous state
   * @returns Cleanup function to unsubscribe
   */
  subscribe: (listener: Listener<T>) => () => void;
}

export function createStore<T extends Record<string, unknown>>(
  initialState: T,
  equalityFn?: (state: T, previousState: T) => boolean,
  ...middleware: Middleware<T>[]
): Store<T> {
  let state = initialState;
  let previousState = initialState;
  const listeners = new Set<Listener<T>>();
  const equals = equalityFn || deepEqual;

  function getState() {
    return state;
  }
  function getInitialState() {
    return initialState;
  }
  function getPreviousState() {
    return previousState;
  }

  let setState = (fn: (state: T) => T): void => {
    const updatedState = fn(state);
    previousState = state;
    state = updatedState;
    listeners.forEach((listener) => listener(state, previousState));
  };

  const store: Store<T> = {
    getState,
    getInitialState,
    getPreviousState,
    setState,
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  if (middleware.length > 0) {
    const middlewareAction = middleware
      .slice()
      .reverse()
      .reduce(
        (prev, mw) => mw(store)(prev),
        (updatedState: T) => setState(() => updatedState),
      );

    setState = (fn: (state: T) => T) => {
      const updatedState = fn(state);
      if (equals(state, updatedState)) return;
      middlewareAction(updatedState);
    };
  }

  return { ...store, setState };
}
