import polyfill from 'object-keys';

/**
 * Object.keys function using generic inference.
 */
type GetKeys = <T extends object> (object: T) => Array<Exclude<keyof T, number | symbol>>;

/**
 * Get a collection of object's properties.
 * @param object
 */
const keys = (Object.keys || polyfill) as GetKeys;

export default keys;
