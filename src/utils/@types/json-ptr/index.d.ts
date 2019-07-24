/* eslint-disable @typescript-eslint/no-explicit-any */
// Disabled `@typescript-eslint/no-explicit-any` due to using a library without typings
// See: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md#when-not-to-use-it

// Type definitions for json-ptr 1.1.2
// Project: https://github.com/flitbit/json-ptr
// Definitions by: Jonathan Hart <https://github.com/stuajnht>

declare class JsonPointer {
  /** Contains the pointer's path segements. */
  public path: string[];

  /** The pointer's JSON string representation. */
  public pointer: string;

  /** The pointer's URI fragment identifier representation. */
  public uriFragmentIdentifier: string;
}

declare module "json-ptr" {
  /**
   * Creates an instance of the JsonPointer class.
   *
   * @param pointer A JSON pointer in JSON string representation or URI fragment identifier representation
   * @returns A new JsonPointer instance
   * @example
   *   var pointer = ptr.create('/legumes/0');
   *   //fragmentId: #/legumes/0
   */
  export function create(pointer: string): JsonPointer;

  /**
   * Determines whether the specified target has a value at the pointer's path.
   *
   * @param target The target object
   * @param pointer A JSON pointer in JSON string representation or URI fragment identifier representation
   * @returns the dereferenced value or undefined if nonexistent
   */
  export function has(target: object, pointer: string): boolean | undefined;

  /**
   * Gets a value from the specified target object at the pointer's path.
   *
   * @param target The target object
   * @param pointer A JSON pointer in JSON string representation or URI fragment identifier representation
   * @returns The dereferenced value or undefined if nonexistent
   * @example
   *   var value = ptr.get(data, '/legumes/1');
   *   // fragmentId: #/legumes/1
   */
  export function get(target: object, pointer: string): any | undefined;

  /**
   * Sets the value at the specified pointer on the target. The default behavior is to do nothing if pointer is nonexistent.
   *
   * @param target The target object
   * @param pointer A JSON pointer in JSON string representation or URI fragment identifier representation
   * @param value The value to be set at the specified pointer's path
   * @param force Indicates whether nonexistent paths are created during the call
   * @returns The prior value at the pointer's path - therefore, undefined means the pointer's path was nonexistent
   * @example
   *   var prior = ptr.set(data, '#/legumes/1/instock', 50);
   * @example
   *   var data = {};
   *
   *   ptr.set(data, '#/peter/piper', 'man', true);
   *   ptr.set(data, '#/peter/pan', 'boy', true);
   *   ptr.set(data, '#/peter/pickle', 'dunno', true);
   *
   *   console.log(JSON.stringify(data, null, '  '));
   *
   *   {
   *     "peter": {
   *       "piper": "man",
   *       "pan": "boy",
   *       "pickle": "dunno"
   *     }
   *   }
   */
  export function set(
    target: object,
    pointer: string,
    value: any,
    force?: boolean
  ): any | undefined;

  /**
   * Lists all of the pointers available on the specified target.
   *
   * @param target The target object
   * @param fragmentId Indicates whether fragment identifiers should be listed instead of pointers
   * @returns An array of pointer-value pairs
   * @example
   *   var list = ptr.list(data);
   *
   *   [ ...
   *     {
   *       "pointer": "/legumes/2/unit",
   *       "value": "ea"
   *     },
   *     {
   *       "pointer": "/legumes/2/instock",
   *       "value": 9340
   *     },
   *     {
   *       "pointer": "/legumes/3/name",
   *       "value": "plit peas"
   *     },
   *     {
   *       "pointer": "/legumes/3/unit",
   *       "value": "lbs"
   *     },
   *     {
   *       "pointer": "/legumes/3/instock",
   *       "value": 8
   *     }
   *   ]
   */
  export function list(target: object, fragmentId: boolean): any[];

  /**
   * Flattens an object graph (the target) into a single-level object of pointer-value pairs.
   *
   * @param target The target object
   * @param fragmentId Indicates whether fragment identifiers should be listed instead of pointers
   * @returns A flattened object of property-value pairs as properties
   * @example
   *   var obj = ptr.flatten(data, true);
   *
   *   { ...
   *     "#/legumes/1/name": "lima beans",
   *     "#/legumes/1/unit": "lbs",
   *     "#/legumes/1/instock": 21,
   *     "#/legumes/2/name": "black eyed peas",
   *     "#/legumes/2/unit": "ea",
   *     "#/legumes/2/instock": 9340,
   *     "#/legumes/3/name": "plit peas",
   *     "#/legumes/3/unit": "lbs",
   *     "#/legumes/3/instock": 8
   *   }
   */
  export function flatten(target: object, fragmentId?: boolean): object;

  /**
   * Flattens an object graph (the target) into a Map object.
   *
   * @param target The target object
   * @param fragmentId Indicates whether fragment identifiers should be listed instead of pointers
   * @returns A Map object containing key-value pairs where keys are pointers
   * @example
   *   var map = ptr.map(data, true);
   *
   *   for (let it of map) {
   *     console.log(JSON.stringify(it, null, '  '));
   *   }
   *
   *   ...
   *   ["#/legumes/0/name", "pinto beans"]
   *   ["#/legumes/0/unit", "lbs"]
   *   ["#/legumes/0/instock", 4 ]
   *   ["#/legumes/1/name", "lima beans"]
   *   ["#/legumes/1/unit", "lbs"]
   *   ["#/legumes/1/instock", 21 ]
   *   ["#/legumes/2/name", "black eyed peas"]
   *   ["#/legumes/2/unit", "ea"]
   *   ["#/legumes/2/instock", 9340 ]
   *   ["#/legumes/3/name", "plit peas"]
   *   ["#/legumes/3/unit", "lbs"]
   *   ["#/legumes/3/instock", 8 ]
   */
  export function map(target: object, fragmentId?: boolean): Map<string, any>;

  /**
   * Decodes the specified pointer.
   *
   * @param pointer A JSON pointer in JSON string representation or URI fragment identifier representation
   * @returns An array of path segments used as indexers to descend from a root/target object to a referenced value
   * @example
   *   var path = ptr.decode('#/legumes/1/instock');
   *
   *   [ "legumes", "1", "instock" ]
   */
  export function decode(pointer: string): string[];

  /**
   * Decodes the specified pointer.
   *
   * @param pointer A JSON pointer in JSON string representation
   * @returns An array of path segments used as indexers to descend from a root/target object to a referenced value
   * @example
   *   var path = ptr.decodePointer('/people/wilbur dongleworth/age');
   *
   *   [ "people", "wilbur dongleworth", "age" ]
   */
  export function decodePointer(pointer: string): string[];

  /**
   * Encodes the specified path as a JSON pointer in JSON string representation.
   *
   * @param path An array of path segments
   * @returns A JSON pointer in JSON string representation
   * @example
   *   var path = ptr.encodePointer(['people', 'wilbur dongleworth', 'age']);
   *
   *   "/people/wilbur dongleworth/age"
   */
  export function encodePointer(path: string[]): string;

  /**
   * Decodes the specified pointer.
   *
   * @param pointer A JSON pointer in URI fragment identifier representation
   * @returns An array of path segments used as indexers to descend from a root/target object to a referenced value
   * @example
   *   var path = ptr.decodePointer('#/people/wilbur%20dongleworth/age');
   *
   *   [ "people", "wilbur dongleworth", "age" ]
   */
  export function decodeUriFragmentIdentifier(pointer: string): string[];

  /**
   * Encodes the specified path as a JSON pointer in URI fragment identifier representation.
   *
   * @param path An array of path segments
   * @returns A JSON pointer in URI fragment identifier representation
   * @example
   *   var path = ptr.encodePointer(['people', 'wilbur dongleworth', 'age']);
   *
   *   "#/people/wilbur%20dongleworth/age"
   */
  export function encodeUriFragmentIdentifier(path: string[]): string;

  /**
   * Restores a conflicting JsonPointer variable in the global/root namespace (not necessary in node, but useful in browsers).
   */
  export function noConflict(): void;
}
