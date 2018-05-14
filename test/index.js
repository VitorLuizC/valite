import test from 'ava';
import { validate, ValidatorError } from '../';

const validators = [
  (value) => !value || 'value is falsy',
  (value) => value === null || 'value is not null',
  (value) => new Promise((resolve) => setTimeout(() => resolve(true), 500)),
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
    (value) => false, // false is unexpected.
  ];
  await context.throws(validate(0, validators), ValidatorError)
});

test('empty validator message throws a ValidatorError', async (context) => {
  const validators = [
    (value) => value || ''
  ];
  await context.throws(validate(0, validators), ValidatorError)
});
