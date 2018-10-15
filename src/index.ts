import get from 'get-value';
import ValidatorError from './ValidatorError';
import {
  isMessage,
  isMessageSchema,
  Message,
  MessageSchema,
} from './message';

export { Message, MessageSchema, ValidatorError };

/**
 * Get an Array of properties from a given object.
 */
const keys = Object.keys as <T = any> (object: T) => Extract<keyof T, string>[];

/**
 * A function which receives a value and return true or an error message.
 */
export type Validator = (value: any) => string | true | Promise<string | true>;

/**
 * A schema of property names and their validators.
 */
export type ValidatorSchema = { [property: string]: Array<Validator>; };

/**
 * Sequentially executes validators over the value. Returns the first error
 * message or `null` otherwise.
 * @param value
 * @param validators
 */
export const validate = async (
  value: any,
  [validator, ...validators]: Array<Validator> = [],
): Promise<Message> => {
  try {
    if (typeof validator !== 'function')
      return null;
    const message = await validator(value);
    return isMessage(message) ? message : validate(value, validators);
  } catch (error) {
    if (error instanceof ValidatorError)
      throw error;
    throw new ValidatorError('Error on validator: ' + error && error.message);
  }
};

/**
 * Concurrenly validates an object with an schema. It executes validators for
 * deep properties and returns a message schema.
 * @param object
 * @param schema
 */
export const validateObject = async <T extends ValidatorSchema> (
  object: object,
  schema: T,
): Promise<MessageSchema<T>> => {
  const errors = Object.create(null) as MessageSchema<T>;
  const toResolution = async (property: string): Promise<void> => {
    const value = get(object, property);
    errors[property] = await validate(value, schema[property]);
  };
  await Promise.all(keys(schema).map(toResolution));
  return errors;
};

/**
 * Check if error message or error message schema is empty, and therefore valid.
 * @param error
 */
export const isValid = (
  error: Message | MessageSchema<any>,
): boolean => {
  if (!isMessageSchema(error))
    return !isMessage(error);
  const isError = (property: string) => typeof error[property] === 'string';
  return !keys(error).some(isError);
};
