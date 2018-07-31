import polyfill from 'object-keys';

/**
 * Get a collection of object's properties.
 */
export default (Object.keys || polyfill) as <T extends object>(object: T) => Array<keyof T>;
