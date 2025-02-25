import { Middleware } from '../core/store';

export function storageMiddleware<T>(
  key: string,
  storage: Storage,
): Middleware<T> {
  return (store) => (next) => (state) => {
    next(state);
    storage.setItem(key, JSON.stringify(store.getState()));
  };
}
