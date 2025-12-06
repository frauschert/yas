import { Middleware } from '../core/store';

export function storageMiddleware<T>(
  key: string,
  storage: Storage,
): Middleware<T> {
  return () => (next) => (state) => {
    next(state);
    storage.setItem(key, JSON.stringify(state));
  };
}
