import { describe, it, expect, vi } from 'vitest';
import { storageMiddleware } from './storageMiddleware';
import { createStore } from '../core/store';

const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string => store[key] ?? null,
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value.toString();
    }),
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (index: number): string | null => '',
    length: Object.keys(store).length,
  };
})();

describe('localStorageMiddleware', () => {
  it('should save state to localStorage', () => {
    const key = 'testKey';
    const initialState = { count: 0 };
    const store = createStore(
      initialState,
      undefined,
      storageMiddleware(key, localStorageMock),
    );

    store.setState((state) => ({ ...state, count: state.count + 1 }));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify({ count: 1 }),
    );
  });
});
