import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { createStore } from '../core/store';
import { createUseStore } from './store';

describe('createUseStore', () => {
  it('should return selected state from store', () => {
    const store = createStore({ count: 5, name: 'test' });
    const useStore = createUseStore(store);

    const { result } = renderHook(() => useStore((state) => state.count));

    expect(result.current).toBe(5);
  });

  it('should update when selected state changes', async () => {
    const store = createStore({ count: 0, name: 'test' });
    const useStore = createUseStore(store);

    const { result } = renderHook(() => useStore((state) => state.count));

    expect(result.current).toBe(0);

    act(() => {
      store.setState((state) => ({ ...state, count: 1 }));
    });

    await waitFor(() => expect(result.current).toBe(1));
  });

  it('should not re-render when unrelated state changes', async () => {
    const store = createStore({ count: 0, name: 'test' });
    const useStore = createUseStore(store);
    const renderSpy = vi.fn();

    const { result } = renderHook(() => {
      renderSpy();
      return useStore((state) => state.count);
    });

    expect(result.current).toBe(0);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      store.setState((state) => ({ ...state, name: 'updated' }));
    });

    // Wait a bit to ensure no re-render happens
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(0);
  });

  it('should work with custom equality function', async () => {
    const store = createStore({ user: { id: 1, name: 'John' } });
    const useStore = createUseStore(store);
    const renderSpy = vi.fn();

    const equalityFn = (a: any, b: any) => a?.id === b?.id;

    const { result } = renderHook(() => {
      renderSpy();
      return useStore((state) => state.user, equalityFn);
    });

    expect(result.current).toEqual({ id: 1, name: 'John' });
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      store.setState((state) => ({
        user: { ...state.user, name: 'Jane' },
      }));
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should not re-render because id is the same
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({ id: 1, name: 'John' });
  });

  it('should re-render with custom equality when it returns false', async () => {
    const store = createStore({ user: { id: 1, name: 'John' } });
    const useStore = createUseStore(store);

    const equalityFn = (a: any, b: any) => a?.id === b?.id;

    const { result } = renderHook(() =>
      useStore((state) => state.user, equalityFn),
    );

    expect(result.current).toEqual({ id: 1, name: 'John' });

    act(() => {
      store.setState((state) => ({
        user: { id: 2, name: 'John' },
      }));
    });

    await waitFor(() =>
      expect(result.current).toEqual({ id: 2, name: 'John' }),
    );
  });

  it('should handle derived/computed state', async () => {
    const store = createStore({ items: [1, 2, 3, 4, 5] });
    const useStore = createUseStore(store);

    const { result } = renderHook(() =>
      useStore((state) => state.items.filter((n) => n % 2 === 0)),
    );

    expect(result.current).toEqual([2, 4]);

    act(() => {
      store.setState((state) => ({ items: [...state.items, 6] }));
    });

    await waitFor(() => expect(result.current).toEqual([2, 4, 6]));
  });

  it('should memoize selector results', async () => {
    const store = createStore({ items: [{ id: 1 }, { id: 2 }] });
    const useStore = createUseStore(store);
    const renderSpy = vi.fn();

    const { result } = renderHook(() => {
      renderSpy();
      return useStore((state) => state.items);
    });

    const firstResult = result.current;
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      // Same array reference, should not trigger re-render
      store.setState((state) => ({ ...state, items: state.items }));
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(firstResult);
  });

  it('should handle multiple subscribers independently', async () => {
    const store = createStore({ count: 0 });
    const useStore = createUseStore(store);

    const { result: result1 } = renderHook(() =>
      useStore((state) => state.count),
    );
    const { result: result2 } = renderHook(() =>
      useStore((state) => state.count * 2),
    );

    expect(result1.current).toBe(0);
    expect(result2.current).toBe(0);

    act(() => {
      store.setState((state) => ({ count: 5 }));
    });

    await waitFor(() => {
      expect(result1.current).toBe(5);
      expect(result2.current).toBe(10);
    });
  });

  it('should update selector reference on rerender', async () => {
    const store = createStore({ count: 0 });
    const useStore = createUseStore(store);
    let multiplier = 1;

    const { result, rerender } = renderHook(() =>
      useStore((state) => state.count * multiplier),
    );

    expect(result.current).toBe(0);

    act(() => {
      store.setState((state) => ({ count: 5 }));
    });

    await waitFor(() => expect(result.current).toBe(5));

    multiplier = 2;
    rerender();

    expect(result.current).toBe(10);
  });

  it('should handle selectors returning undefined', () => {
    const store = createStore({ count: 0 });
    const useStore = createUseStore(store);

    const { result } = renderHook(() =>
      useStore((state) => (state as any).nonexistent),
    );

    expect(result.current).toBeUndefined();
  });

  it('should work with primitive values', async () => {
    const store = createStore({ value: 'hello' });
    const useStore = createUseStore(store);

    const { result } = renderHook(() => useStore((state) => state.value));

    expect(result.current).toBe('hello');

    act(() => {
      store.setState((state) => ({ value: 'world' }));
    });

    await waitFor(() => expect(result.current).toBe('world'));
  });

  it('should handle rapid state changes', async () => {
    const store = createStore({ count: 0 });
    const useStore = createUseStore(store);

    const { result } = renderHook(() => useStore((state) => state.count));

    act(() => {
      store.setState((state) => ({ count: state.count + 1 }));
      store.setState((state) => ({ count: state.count + 1 }));
      store.setState((state) => ({ count: state.count + 1 }));
    });

    await waitFor(() => expect(result.current).toBe(3));
  });

  it('should use Object.is as default equality', () => {
    const store = createStore({ obj: { id: 1 } });
    const useStore = createUseStore(store);
    const renderSpy = vi.fn();

    const { result } = renderHook(() => {
      renderSpy();
      return useStore((state) => state.obj);
    });

    const firstObj = result.current;
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      // New object with same values
      store.setState(() => ({ obj: { id: 1 } }));
    });

    // Should trigger re-render because Object.is checks reference
    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(result.current).not.toBe(firstObj);
    expect(result.current).toEqual({ id: 1 });
  });

  it('should properly cleanup subscriptions on unmount', () => {
    const store = createStore({ count: 0 });
    const useStore = createUseStore(store);
    const listener = vi.fn();

    store.subscribe(listener);

    const { unmount } = renderHook(() => useStore((state) => state.count));

    unmount();

    act(() => {
      store.setState((state) => ({ count: 1 }));
    });

    // Store should still notify other subscribers
    expect(listener).toHaveBeenCalled();
  });

  it('should handle complex nested selectors', async () => {
    const store = createStore({
      users: [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
        { id: 3, name: 'Charlie', active: true },
      ],
    });
    const useStore = createUseStore(store);

    const { result } = renderHook(() =>
      useStore((state) =>
        state.users.filter((u) => u.active).map((u) => u.name),
      ),
    );

    expect(result.current).toEqual(['Alice', 'Charlie']);

    act(() => {
      store.setState((state) => ({
        users: [...state.users, { id: 4, name: 'Diana', active: true }],
      }));
    });

    await waitFor(() =>
      expect(result.current).toEqual(['Alice', 'Charlie', 'Diana']),
    );
  });
});
