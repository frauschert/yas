import { Store } from './store';

interface UndoableStore<T> extends Store<T> {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

export function makeUndoable<T extends Record<string, unknown>>(
  store: Store<T>,
  maxHistorySize = 50,
): UndoableStore<T> {
  const past: T[] = [];
  const future: T[] = [];

  const wrappedStore: UndoableStore<T> = {
    ...store,
    setState: (fn) => {
      const currentState = store.getState();
      store.setState(fn);

      past.push(currentState);
      if (past.length > maxHistorySize) {
        past.shift();
      }
      future.length = 0; // Clear redo stack on new change
    },
    undo: () => {
      if (!past.length) return;

      const currentState = store.getState();
      const previousState = past.pop()!;

      future.push(currentState);
      store.setState(() => previousState);
    },
    redo: () => {
      if (!future.length) return;

      const currentState = store.getState();
      const nextState = future.pop()!;

      past.push(currentState);
      store.setState(() => nextState);
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
    clearHistory: () => {
      past.length = 0;
      future.length = 0;
    },
  };

  return wrappedStore;
}
