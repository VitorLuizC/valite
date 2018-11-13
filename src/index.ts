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
 * A key from an object.
 */
type Key <T = any> = Extract<keyof T, string>;

/**
 * Get an Array of keys from a given object.
 */
const keys = Object.keys as <T = any> (object: T) => Key<T>[];

/**
 * A function which receives a value and return true or an error message.
 */
export type Validator = (value: any) => string | true | Promise<string | true>;

/**
 * Sequentially executes validators over the value. Returns the first error
 * message or `null` otherwise.
 * @param value
 * @param validators
 */
export const validate = (
  value: any,
  [validator, ...validators]: Array<Validator> = []
): Promise<Message> => (
  typeof validator !== 'function'
    ? Promise.resolve(null)
    : Promise.resolve(validator(value))
      .then((message) => isMessage(message) ? message : validate(value, validators))
);

/**
 * A schema of property names and their validators.
 */
export type ValidatorSchema = { [property: string]: Array<Validator>; };

/**
 * Concurrenly validates an object with an schema. It executes validators for
 * deep properties and returns a message schema.
 * @param object
 * @param schema
 */
export const validateObject = <T extends ValidatorSchema> (
  object: object,
  schema: T,
): Promise<MessageSchema<T>> => {
  const errors = Object.create(null) as MessageSchema<T>;
  const resolutions = keys(schema).map((key): Promise<void> => (
    validate(get(object, key), schema[key]).then((message) => {
      errors[key] = message;
    })
  ));
  return Promise.all(resolutions).then(() => errors);
};

/**
 * Check if error message or error message schema is empty, and therefore valid.
 * @param error
 */
export const isValid = (
  error: Message | MessageSchema<any>,
): boolean => (
  !isMessageSchema(error)
    ? error === null
    : keys(error).every((key) => error[key] === null)
);
