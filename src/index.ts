import keys from './keys';
import ValidatorError from './ValidatorError';

type Validator = (value: any) => string | true | Promise<string | true>;

function isMessage (message: string | true): message is string {
  const isEmpty = typeof message === 'string' && !message.trim();
  const isWrong = message !== true && typeof message !== 'string';

  if (isWrong)
    throw new ValidatorError('Should return true or a non-empty string.');
  if (isEmpty)
    throw new ValidatorError('Empty validator message.');
  return message !== true;
}

async function validate (value: any, validators: Array<Validator> = []) {
  const execute = (validator: Validator) => validator(value);
  const messages = await Promise.all(validators.map(execute));
  const message = messages.find(isMessage) || null;
  return message;
}

function getProperty (object: object, property: string): any {
  try {
    const get = new Function('object', `return object.${property}`);
    return get(object);
  } catch (_) {
    return;
  }
}

type ValidatorSchema = { [property: string]: Array<Validator> };

async function validateProperties <T extends ValidatorSchema> (
  object: object,
  schema: T
): Promise<{ [property in keyof T]: string }> {
  const execute = async (property) => {
    const value = getProperty(object, property);
    return {
      [property]: await validate(value, schema[property])
    };
  };
  const errors = await Promise.all(keys(schema).map(execute));
  return Object.assign({}, ...errors) as { [property in keyof T]: string };
}

type ErrorSchema = { [property: string]: string; };

function isValid (error: string | ErrorSchema): boolean {
  if (error === null || typeof error !== 'object')
    return !isMessage(error as string);
  const isError = (property) => typeof error[property] === 'string';
  const isValid = !keys(error as ErrorSchema).some(isError);
  return isValid;
}

export {
  isValid,
  validate,
  Validator,
  ValidatorError,
  ValidatorSchema,
  validateProperties
}
