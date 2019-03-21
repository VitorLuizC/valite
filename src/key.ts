/**
 * A key from an object.
 */
export type KeyOf<T> = Extract<keyof T, string>;

/**
 * Get an Array of keys from a given object.
 */
export const keys = Object.keys as <T>(object: T) => KeyOf<T>[];
