import { describe, it, expect, vi } from 'vitest';
import { createStore } from './store';

describe('createStore', () => {
  it('should initialize with the given state', () => {
    const store = createStore({ count: 0 });
    expect(store.getState().count).toBe(0);
  });

  it('should update the state', () => {
    const store = createStore({ count: 0 });
    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(store.getState().count).toBe(1);
  });

  it('should subscribe to state changes', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);
    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(listener).toHaveBeenCalledWith({ count: 1 }, { count: 0 });
  });
});

describe('createStore with middleware', () => {
  it('should apply middleware', () => {
    const middleware = vi.fn((store) => (next: any) => (state: any) => {
      next({ ...state, count: state.count + 1 });
    });
    const store = createStore({ count: 0 }, undefined, [middleware]);
    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(store.getState().count).toBe(2);
    expect(middleware).toHaveBeenCalled();
  });
});
