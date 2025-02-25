# YAS (Yet Another State)

A lightweight and type-safe state management solution for vanilla and React applications.

## Features

- 🎯 Type-safe state management
- 🔄 Undo/Redo functionality
- ⚡️ Lightweight and fast
- 🧩 Middleware support
- 🎣 React hooks integration
- 📦 Zero dependencies

## Installation

```bash
npm install @frauschert/yas
```

## Basic Usage

```typescript
import { create } from '@frauschert/yas';

const store = create({
  initialState: { count: 0 },
  actions: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    incrementBy: (state, amount: number) => ({
      ...state,
      count: state.count + amount,
    }),
  },
});

// Use in components
function Counter() {
  const count = store.useStore((state) => state.count);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={store.actions.increment}>Increment</button>
      <button onClick={store.actions.decrement}>Decrement</button>
      <button onClick={() => store.actions.incrementBy(5)}>Add 5</button>
    </div>
  );
}
```

## Advanced Usage

### Using Middleware

```typescript
const loggerMiddleware = (store) => (next) => (state) => {
  console.log('Previous:', store.getPreviousState());
  console.log('Next:', state);
  next(state);
};

const store = create({
  initialState: { count: 0 },
  actions: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
  },
  middleware: [loggerMiddleware],
});
```

### Undo/Redo

```typescript
import { makeUndoable, createStore } from '@frauschert/yas';

const store = makeUndoable(createStore({ count: 0 }));

store.setState((state) => ({ count: state.count + 1 }));
store.setState((state) => ({ count: state.count + 1 }));

store.undo(); // Goes back one step
store.redo(); // Goes forward one step
store.clearHistory(); // Clears undo/redo history
```

### Custom Equality Function

```typescript
const store = create({
  initialState: { user: { name: 'John' } },
  actions: {
    updateUser: (state, name: string) => ({
      ...state,
      user: { ...state.user, name },
    }),
  },
  equalityFn: (state, previousState) =>
    state.user.name === previousState.user.name,
});
```

## API Reference

### create(options)

Creates a new store with React integration.

- `options.initialState`: The initial state object
- `options.actions`: Object containing state update functions
- `options.equalityFn?`: Custom equality function for state comparison
- `options.middleware?`: Array of middleware functions

### makeUndoable(store, maxHistorySize?)

Adds undo/redo capabilities to a store.

- `store`: The store to enhance
- `maxHistorySize`: Maximum number of history entries (default: 50)

## License

MIT
