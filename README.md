# YAS (Yet Another Store)

A lightweight and type-safe state management solution for React applications.

## Features

- 🎯 Type-safe state management
- 🔄 Undo/Redo functionality
- 🎮 Proxy-based state updates
- 🔍 Deep property watching
- ⚡️ Lightweight and fast
- 🧩 Middleware support

## Installation

```bash
npm install @fabian/yas
```

## Basic Usage

```typescript
import { create } from '@fabian/yas';

const store = create({
  initialState: { count: 0 },
  actions: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    incrementBy: (state, amount: number) => ({ 
      ...state, 
      count: state.count + amount 
    }),
  },
});

// Use in components
function Counter() {
  const count = store.useStore(state => state.count);
  
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

### Proxy Store

```typescript
import { createProxyStore } from '@fabian/yas';

const store = createProxyStore({
  user: {
    name: 'John',
    settings: {
      theme: 'dark'
    }
  }
});

// Watch deep properties
store.$watchPath('user.settings.theme', (newTheme, oldTheme) => {
  console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
});
```

### Undo/Redo

```typescript
import { makeUndoable } from '@fabian/yas';

const store = makeUndoable(createStore({ count: 0 }));

store.setState(state => ({ count: state.count + 1 }));
store.setState(state => ({ count: state.count + 1 }));

store.undo(); // Goes back one step
store.redo(); // Goes forward one step
```

## License

MIT
