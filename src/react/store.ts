/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useSyncExternalStore } from 'react';
import { Store, createStore } from '../core/store';

type Middleware<S> = (
  store: Store<S>,
) => (next: (state: S) => void) => (state: S) => void;

type StoreActions<
  T,
  A extends Record<string, (state: T, ...args: any[]) => T>,
> = {
  [K in keyof A]: A[K] extends (state: T, ...args: infer P) => any
    ? (...args: P) => void
    : () => void;
};

function createUseStore<T>(store: Store<T>) {
  return <K>(selector: (state: T) => K) =>
    useSyncExternalStore(
      store.subscribe,
      useCallback(() => selector(store.getState()), [store, selector]),
    );
}
function createActions<T>(store: Store<T>) {
  return <A extends Record<string, (state: T, ...args: any[]) => T>>(
    actions: A,
  ) => {
    return Object.fromEntries(
      Object.entries(actions).map(([key, action]) => [
        key,
        (...args: any[]) => store.setState((state) => action(state, ...args)),
      ]),
    ) as StoreActions<T, A>;
  };
}

interface CreateStoreParams<
  S extends Record<string, unknown> = NonNullable<unknown>,
  A extends Record<string, (state: S) => S> = NonNullable<unknown>,
> {
  /** The initial state of the store */
  initialState: S;
  /** A mapping of actions to update the state */
  actions: A;
  /** A function to determine if the state has changed */
  equalityFn?: (state: S, previousState: S) => boolean;
  /** An array of middleware functions */
  middleware?: Middleware<S>[];
}

export function create<
  S extends Record<string, unknown>,
  A extends Record<string, (state: S, ...args: any[]) => S>,
>({ initialState, actions, equalityFn, middleware }: CreateStoreParams<S, A>) {
  const store = createStore(initialState, equalityFn, middleware);
  const useStore = createUseStore(store);
  const boundActions = createActions(store)(actions);
  return { useStore, actions: boundActions, api: store };
}

/** Example usage 
type DispatchAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'INCREMENT_BY'; by: number }

function reducer(state: { count: number }, action: DispatchAction) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    case 'INCREMENT_BY':
      return { ...state, count: state.count + action.by }
    default:
      return state
  }
}

const persistKey = 'appState'
const savedState = localStorage.getItem(persistKey)
const initialState: { count: number } = savedState
  ? (JSON.parse(savedState) as { count: number })
  : { count: 0 }

const store = create({
  initialState,
  actions: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    incrementBy: (state, by: number) => ({ ...state, count: state.count + by }),
    dispatch: (state, action: DispatchAction) => reducer(state, action)
  },
  middleware: [localStorageMiddleware(persistKey), devToolsMiddleware('AppState')]
})

export const { increment, decrement, incrementBy, dispatch } = store.actions
export const { useStore } = store
*/
