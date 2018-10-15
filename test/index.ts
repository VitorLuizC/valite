import test from 'ava';
import {
  isValid,
  validate,
  validateObject,
  Validator,
  ValidatorError,
  ValidatorSchema,
} from '../';

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
  const errors = await validateObject({ name: null }, { name: validators });
  context.true(isValid(errors));
  context.false(isValid(error));
});

/**
 * Tests for `validateObject` function.
 */

const SUBSCRIBE_VALIDATORS: ValidatorSchema = {
  'user.username': [
    (value) => !!value.trim() || 'Username is required',
    ((value) => new Promise((resolve) => {
      const message = value !== 'VitorLuizC' || 'Username is repeated.';
      setTimeout((_) => resolve(message as true | string), 300);
    })) as Validator
  ],
  'user.password': [
    (value) => !!value.trim() || 'Password is required',
    (value) => value !== '1234' || 'Password is too weak'
  ],
  'terms': [
    (value) => !!value || 'Can\'t subscribe without accept terms.'
  ]
};

test('validateObject: uses schema to validate object', async (context) => {
  const valuesA = {
    user: {
      username: 'haxz_vitor', // This is my PlayStation Account username, please
      password: '0000'        // play Monster Hunter World with me.
    },
    terms: true
  };

  const errorsA = await validateObject(valuesA, SUBSCRIBE_VALIDATORS);

  context.true(isValid(errorsA));
  context.deepEqual(errorsA, {
    'user.username': null,
    'user.password': null,
    'terms': null
  });

  const valuesB = {
    user: {
      username: 'VitorLuizC',
      password: '1234'
    },
    terms: false
  };

  const errorsB = await validateObject(valuesB, SUBSCRIBE_VALIDATORS);

  context.false(isValid(errorsB));
  context.deepEqual(errorsB, {
    'user.username': 'Username is repeated.',
    'user.password': 'Password is too weak',
    'terms': 'Can\'t subscribe without accept terms.'
  });
});

test('Benchmark: Promise.All is faster than a chain', async (context) => {
  const time = Date.now();
  const user = {
    name: null,
    email: null
  };
  const errors = await validateObject(user, {
    name: validators,
    email: validators
  });
  context.true((Date.now() - time) < 250 * 2); // Check if is faster.
  context.true(has(errors, 'name') && has(errors, 'email'));
  context.is(errors.name, null);
  context.is(errors.email, null);
});
