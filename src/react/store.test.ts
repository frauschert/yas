import { describe, it, expect } from 'vitest';
import { create } from './store';

describe('store', () => {
  it('should increment the count', () => {
    const { api, actions } = create({
      initialState: { count: 0 },
      actions: {
        increment: (state) => ({ ...state, count: state.count + 1 }),
      },
    });

    actions.increment();
    const state = api.getState();
    expect(state.count).toBe(1);
  });

  it('should decrement the count', () => {
    const { api, actions } = create({
      initialState: { count: 1 },
      actions: {
        decrement: (state) => ({ ...state, count: state.count - 1 }),
      },
    });

    actions.decrement();
    const count = api.getState().count;
    expect(count).toBe(0);
  });

  it('should increment the count by a specific value', () => {
    const { api, actions } = create({
      initialState: { count: 0 },
      actions: {
        incrementBy: (state, by: number) => ({
          ...state,
          count: state.count + by,
        }),
      },
    });

    actions.incrementBy(5);
    const count = api.getState().count;
    expect(count).toBe(5);
  });
});
