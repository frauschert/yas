import { describe, expect, test } from 'vitest';
import { deepEqual } from './utils';

describe('deepEqual', () => {
  test('should return true for identical objects', () => {
    const obj1 = { a: 1, b: 'test', c: true };
    const obj2 = { a: 1, b: 'test', c: true };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test('should return false for different objects', () => {
    const obj1 = { a: 1, b: 'test', c: true };
    const obj2 = { a: 1, b: 'test', c: false };
    expect(deepEqual(obj1, obj2)).toBe(false);
  });

  test('should return true for nested identical objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 'test' } };
    const obj2 = { a: 1, b: { c: 2, d: 'test' } };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });

  test('should return false for nested different objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: 'test' } };
    const obj2 = { a: 1, b: { c: 2, d: 'different' } };
    expect(deepEqual(obj1, obj2)).toBe(false);
  });

  test('should return true for identical arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(deepEqual(arr1, arr2)).toBe(true);
  });

  test('should return false for different arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(deepEqual(arr1, arr2)).toBe(false);
  });

  test('should return false for objects with different keys', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, c: 2 };
    expect(deepEqual(obj1, obj2)).toBe(false);
  });

  test('should return true for identical objects with different key order', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    expect(deepEqual(obj1, obj2)).toBe(true);
  });
});
