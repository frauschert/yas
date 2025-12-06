# YAS - State Management Library

## Architecture Overview

YAS is a React state management library built around a **three-layer architecture**:

1. **Core layer** (`src/core/`): Framework-agnostic store implementation using subscription pattern
2. **React layer** (`src/react/`): React hooks integration using `useSyncExternalStore`
3. **Middleware layer** (`src/middleware/`): Composable middleware for storage, devtools, etc.

### Key Design Patterns

- **Immutable updates**: All state changes use `setState((state) => newState)` pattern
- **Middleware composition**: Middleware functions are composed right-to-left (like Redux), applied in reverse order
- **Store wrapping**: Enhancement pattern (e.g., `makeUndoable`) wraps stores without modifying original implementation
- **Type-safe actions**: Actions are bound at creation time with full TypeScript inference

## Critical Workflows

### Development Commands

```bash
npm run build      # Vite library build + TypeScript declarations
npm test           # Vitest in watch mode
npm run format     # Prettier formatting
```

### Build Output

- Library builds to `dist/` with dual formats: ES modules (`yas.es.js`) and UMD (`yas.umd.js`)
- TypeScript declarations generated separately via `tsc --emitDeclarationOnly`
- Test files excluded from build via both `tsconfig.json` and `vite.config.ts`

## Code Conventions

### State Updates

Always return new objects; never mutate:

```typescript
// ✓ Correct
actions: {
  increment: (state) => ({ ...state, count: state.count + 1 });
}

// ✗ Wrong
actions: {
  increment: (state) => {
    state.count++;
    return state;
  };
}
```

### Store Creation Duality

Two creation patterns serve different needs:

- `createStore()` - Core vanilla store for library composition (used by `makeUndoable`)
- `create()` - React-integrated store with bound actions and `useStore` hook (primary user API)

### Middleware Signature

Middleware follows Redux-style three-function currying:

```typescript
(store: Store<T>) => (next: (state: T) => void) => (state: T) => void
```

Access `store.getPreviousState()` to compare before/after - this is unique to YAS.

### Testing with Vitest

- Tests colocated with implementation (e.g., `store.test.ts` alongside `store.ts`)
- Use `vi.fn()` for mocks, not `jest.fn()`
- Browser-based testing available via `@vitest/browser` for React hooks

## Integration Points

### React Integration

- Uses `useSyncExternalStore` (React 18+) for concurrent-safe subscriptions
- `useStore` accepts selector functions for partial state subscriptions
- Actions bound at creation time return `void` (not the action result)

### DevTools

`devToolsMiddleware` connects to Redux DevTools Extension via `window.__REDUX_DEVTOOLS_EXTENSION__`

### Storage

`storageMiddleware` accepts any `Storage` interface (localStorage, sessionStorage, custom)

## Important Files

- [src/core/store.ts](../src/core/store.ts) - Core store implementation with middleware composition logic
- [src/react/store.ts](../src/react/store.ts) - React `create()` API and action binding
- [src/core/undoable.ts](../src/core/undoable.ts) - Store enhancement pattern example
- [src/index.ts](../src/index.ts) - Public API surface

## Publishing

- Package scoped as `@frauschert/yas` on npm
- `prepare` script runs build automatically on install from git
- Only `dist/` directory included in published package
