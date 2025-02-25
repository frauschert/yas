import { Store } from '../core/store'

export function devToolsMiddleware<T>(storeName: string) {
  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({ name: storeName })
  return (store: Store<T>) => (next: (state: T) => void) => (state: T) => {
    next(state)
    devTools?.send(storeName, store.getState())
  }
}
