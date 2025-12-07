import { describe, it, expect, vi, beforeEach } from 'vitest';
import { devToolsMiddleware } from './devToolsMiddleware';
import { createStore } from '../core/store';

describe('devToolsMiddleware', () => {
  beforeEach(() => {
    // Mock window object for Node.js environment
    global.window = global.window || ({} as any);
  });

  it('should log actions to the dev tools', () => {
    const name = 'TestApp';
    const initialState = { count: 0 };

    const devTools = {
      send: vi.fn(),
    };
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ = {
      connect: vi.fn(() => devTools),
    };

    const store = createStore(
      initialState,
      undefined,
      devToolsMiddleware(name),
    );

    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(devTools.send).toHaveBeenCalledWith(name, { count: 1 });
  });
});
