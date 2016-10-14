// ---------- ---------- WORKAROUND for Set
interface Set<T> {
  add(value: T): Set<T>;
  clear(): void;
  delete(value: T): boolean;
  forEach(callbackfn: (value: T, index: T, set: Set<T>) => void, thisArg?: any): void;
  has(value: T): boolean;
  entries(): IterableIteratorShim<[T, T]>;
  keys(): IterableIteratorShim<T>;
  values(): IterableIteratorShim<T>;
  '_es6-shim iterator_'(): IterableIteratorShim<T>;
}
interface SetConstructor {
  new <T>(): Set<T>;
  new <T>(iterable: any): Set<T>;
}
declare var Set: SetConstructor;

// Timeout with numbers
declare function setTimeout(callback: (...args: any[]) => void, ms?: number): number;
