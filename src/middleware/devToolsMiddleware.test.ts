import { describe, it, expect, vi } from 'vitest';
import { devToolsMiddleware } from './devToolsMiddleware';
import { createStore } from '../core/store';

describe('devToolsMiddleware', () => {
  it('should log actions to the dev tools', () => {
    const name = 'TestApp';
    const initialState = { count: 0 };

    const devTools = {
      send: vi.fn(),
    };
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ = {
      connect: vi.fn(() => devTools),
    };

    const store = createStore(initialState, undefined, [
      devToolsMiddleware(name),
    ]);

    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(devTools.send).toHaveBeenCalledWith(
      { type: 'SET_STATE' },
      { count: 1 },
    );
  });
});
