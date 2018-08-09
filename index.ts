/**
 * A collection of object keys.
 */
type PropertyKeys <T extends Object> = (PropertyKey & keyof T)[];

/**
 * A collection of object keys which match a type.
 */
type TypedPropertyKeys <T extends Object, U> = Extract<keyof T, U>[];

/**
 * Get a collection of keys from an object.
 * @param object
 */
const getKeys = <T extends Object> (object: T): PropertyKeys<T> => {
  if (typeof Reflect === 'object' && typeof Reflect.ownKeys === 'function')
    return Reflect.ownKeys(object) as PropertyKeys<T>;

  if (typeof Object.getOwnPropertySymbols !== 'function')
    return Object.getOwnPropertyNames(object) as TypedPropertyKeys<T, string>;

  const keys: PropertyKeys<T> = [];

  return keys.concat(
    Object.getOwnPropertyNames(object) as TypedPropertyKeys<T, string>,
    Object.getOwnPropertySymbols(object) as TypedPropertyKeys<T, symbol>
  );
};

/**
 * Type definition for object property descriptors.
 */
export type PropertyDescriptors <T> = PropertyDescriptorMap & {
  [P in keyof T]: TypedPropertyDescriptor<T[P]>
};

/**
 * Get an object with all object property descriptors.
 * @param object
 */
const getDescriptors = <T extends Object> (object: T): PropertyDescriptors<T> => {
  if (typeof Object.getOwnPropertyDescriptors === 'function')
    return Object.getOwnPropertyDescriptors(object) as PropertyDescriptors<T>;

  const descriptors = getKeys(object).reduce((descriptors, key) => {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (descriptor)
      descriptors[key] = descriptor;
    return descriptors;
  }, {} as PropertyDescriptors<T>) as PropertyDescriptors<T>;

  return descriptors;
};

export default getDescriptors;
