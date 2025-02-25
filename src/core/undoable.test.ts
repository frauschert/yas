import { describe, it, expect } from 'vitest';
import { createStore } from './store';
import { makeUndoable } from './undoable';

describe('undoable store', () => {
  it('should maintain original store functionality', () => {
    const store = makeUndoable(createStore({ count: 0 }));
    store.setState((state) => ({ count: state.count + 1 }));
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('should undo state changes', () => {
    const store = makeUndoable(createStore({ count: 0 }));

    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));
    expect(store.getState()).toEqual({ count: 2 });

    store.undo();
    expect(store.getState()).toEqual({ count: 1 });

    store.undo();
    expect(store.getState()).toEqual({ count: 0 });
  });

  it('should redo undone changes', () => {
    const store = makeUndoable(createStore({ count: 0 }));

    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));
    store.undo();
    store.undo();

    store.redo();
    expect(store.getState()).toEqual({ count: 1 });

    store.redo();
    expect(store.getState()).toEqual({ count: 2 });
  });

  it('should clear future states when making new changes', () => {
    const store = makeUndoable(createStore({ count: 0 }));

    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));
    store.undo();
    expect(store.getState()).toEqual({ count: 1 });

    store.setState((state) => ({ count: state.count + 5 }));
    expect(store.canRedo()).toBe(false);
    expect(store.getState()).toEqual({ count: 6 });
  });

  it('should respect max history size', () => {
    const store = makeUndoable(createStore({ count: 0 }), 2);

    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));

    let undoCount = 0;
    while (store.canUndo()) {
      store.undo();
      undoCount++;
    }

    expect(undoCount).toBe(2);
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('should handle clearHistory', () => {
    const store = makeUndoable(createStore({ count: 0 }));

    store.setState((state) => ({ count: state.count + 1 }));
    store.setState((state) => ({ count: state.count + 1 }));
    store.clearHistory();

    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(false);
    expect(store.getState()).toEqual({ count: 2 });
  });
});
