import ValidatorError from './ValidatorError';
import { KeyOf } from './key';

/**
 * An error message is a non-empty string or just null.
 */
export type Message = string | null;

/**
 * A schema using the name and error message of the properties.
 */
export type MessageSchema<T> = Record<KeyOf<T>, Message>;

/**
 * Check if value is a message.
 * @param value
 */
export const isMessage = (
  value: unknown,
): value is string => {
  if (typeof value !== 'string' && value !== true)
    throw new ValidatorError('Validator should return `true` or a message instead.');
  if (typeof value === 'string' && !value.trim())
    throw new ValidatorError('Validator message shouldn\'t be empty.');
  return value !== true;
};

/**
 * Check if value is a message schema.
 * @param value
 */
export const isMessageSchema = (
  value: unknown,
): value is MessageSchema<any> => value !== null && typeof value === 'object';
