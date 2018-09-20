import test from 'ava';
import { validate, ValidatorError, isValid, validateSchema } from '../';

const has = Function.call.bind(Object.prototype.hasOwnProperty);
const validators = [
  (value) => !value || 'value is falsy',
  (value) => value === null || 'value is not null',
  () => new Promise((resolve) => setTimeout(() => resolve(true), 250)) as Promise<true>
];

test('validate returns null when is valid', async (context) => {
  const error = await validate(null, validators);
  context.is(error, null)
});

test('validate returns error messagen when is invalid', async (context) => {
  const error = await validate(undefined, validators);
  context.is(error, 'value is not null')
});

test('unexpected validator return throws a ValidatorError', async (context) => {
  const validators = [
    (value) => (false) as true | '', // false is unexpected.
  ];
  await context.throws(validate(0, validators), ValidatorError)
});

test('empty validator message throws a ValidatorError', async (context) => {
  const validators = [
    (value) => value || ''
  ];
  await context.throws(validate(0, validators), ValidatorError)
});

test('isValid check if value/object is valid', async (context) => {
  const error = await validate(undefined, validators);
  const errors = await validateSchema({ name: null }, { name: validators });
  context.true(isValid(errors));
  context.false(isValid(error));
});

test('validateProperties returns an error schema', async (context) => {
  const errors = await validateSchema({}, { name: validators });
  context.true(errors && typeof errors === 'object', 'is not even an object');
  context.true(has(errors, 'name'));
  context.is(errors.name, 'value is not null');
});

test('Benchmark: Promise.All is faster than a chain', async (context) => {
  const time = Date.now();
  const user = {
    name: null,
    email: null
  };
  const errors = await validateSchema(user, {
    name: validators,
    email: validators
  });
  context.true((Date.now() - time) < 250 * 2); // Check if is faster.
  context.true(has(errors, 'name') && has(errors, 'email'));
  context.is(errors.name, null);
  context.is(errors.email, null);
});
