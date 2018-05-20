# valite

## Truly simple, practical and light validator engine.

[![Build Status][ci-badge]][ci]

I spent some time looking for a validation module that was simple, practical and light. All I found were modules that promise simplicity, but deliver complex APIs; they promise lightness, but deliver very heavy dependencies; promise practicality, but deliver ready-made functions that do not meet our needs, and it is necessary to download new modules and configure messages to change language and validation behavior.

So I wrote `valite`, unlike all of them, it's just the _core_ needed to build your validations. It is asynchronous by default, as everything should be in JavaScript, and has an extremely simple and concise API.

## Install

`valite` is published under NPM registry, so you can install from any JavaScript/Node package manager.

```sh
npm install valite --save
```

## API

The API is composed by a validation function, `validate`, a validation object function `validateProperties` and `isValid` which is a simple error checker.

- `validate` receives a value and a list of validations and returns the first obtained message or null if all the validations pass.

  ```ts
  async function validate (value: any, validators: Validator[] = []): string | null;
  ```

- `validateProperties` receives an object and a validator schema and returns an error schema, this schema uses same properties as validator schema but their value are first obtained message or null if all the validations pass.

  ```ts
  type ValidatorSchema = { [property: string]: Validator[] };

  type ErrorSchema <T extends ValidatorSchema> = { [property in keyof T]: string | null };

  async function validateProperties <T extends ValidatorSchema> (object: object, schema: T): ErrorSchema<T>;
  ```

- `isValid` just check if `validate`/`validateProperties` result has no errors.

  ```ts
  function isValid (error: null | string | { [property: string]: string | null }): boolean;
  ```

- `Validation` is a function that receives the value and returns `true` if it is valid and a non-empty `string` message if invalid. Validations can be asynchronous and in this case they resolve to `Promise<true | string>`.

  ```ts
  type Validator = (value: any) => string | true | Promise<string | true>;
  ```

## Example

```js
import { validate } from 'valite';

/**
 * A validator to check if value's length is between min & max arguments.
 * @param {number} min
 * @param {number} max
 * @returns {Validator}
 */
function isLengthBetween (min, max) {
  const message = `Is not between ${min} & ${max} characters.`;
  return (value) => (value.length >= min && value.length <= max) || message;
}

async function onSubmit () {
  const code = document.querySelector('.js-code-field').value.trim();

  const error = await validate(code, [
    (value) => !!value || 'Code is required.',
    (value) => /\D/.test(value) || 'Code should be numeric.',
    isLengthBetween(4, 8)
  ]);

  if (error) {
    alert(error);
    return;
  }

  // ...
}
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->

[license]: ./LICENSE.md
[ci]: https://travis-ci.org/VitorLuizC/valite
[ci-badge]: https://travis-ci.org/VitorLuizC/valite.svg?branch=master
