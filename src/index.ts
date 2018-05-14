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

export { validate, Validator, ValidatorError, validate as default }
