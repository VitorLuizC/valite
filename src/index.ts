import take from 'object-take';
import assign from 'object-assign';
import { Message, MessageSchema, isMessage, isMessageSchema } from './message';
import ValidatorError from './ValidatorError';

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
 * Execute concurrently validators on a value and return first error message.
 * @param value
 * @param validators
 */
export const validate = async (value: any, validators: Array<Validator> = []): Promise<Message> => {
  const resolutions = validators.map((validator) => validator(value));
  const [ message ] = (await Promise.all(resolutions)).filter(isMessage);
  return (message || null) as Message;
};

/**
 * Validate the whole schema concurrenly executing validators for every property
 * and returning a mirror schema with first error message for every property.
 * @param object
 * @param schema
 */
export const validateSchema = async <T extends ValidatorSchema> (object: object, schema: T): Promise<MessageSchema<T>> => {
  const errors = await Promise.all(keys(schema).map(
    async (property: string) => ({
      [property]: await validate(take(object, property), schema[property])
    })
  ));

  return assign.apply(null, errors) as MessageSchema<T>;
};

/**
 * Check if error message or error message schema is empty, and therefore valid.
 * @param error
 */
export const isValid = (error: Message | MessageSchema<any>): boolean => {
  if (!isMessageSchema(error))
    return !isMessage(error);
  const isError = (property: string) => typeof error[property] === 'string';
  const isValid = !keys(error).some(isError);
  return isValid;
};
