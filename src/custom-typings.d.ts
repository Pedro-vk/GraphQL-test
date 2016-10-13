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

// Interface for schema validation
interface JsonSchema {
  $ref?: string;
  id?: string;
  $schema?: JsonSchema;
  title?: string;
  description?: string;
  'default'?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | JsonSchema;
  items?: JsonSchema | JsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JsonSchema;
  definitions?: { [key: string]: JsonSchema };
  properties?: { [property: string]: JsonSchema };
  patternProperties?: { [pattern: string]: JsonSchema };
  dependencies?: { [key: string]: JsonSchema | string[] };
  'enum'?: any[];
  type?: string | string[];
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  not?: JsonSchema;
}

// Jsen JSON schema validator
declare module 'jsen' {
  let jsen: (schema: JsonSchema) => {
    (json: any): boolean;
    errors: any[];
  };
  export = jsen;
}

// Timeout with numbers
declare function setTimeout(callback: (...args: any[]) => void, ms?: number): number;
