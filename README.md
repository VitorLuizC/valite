# valite

[![Build Status][ci-badge]][ci]

Truly simple, practical and light validator engine.

## Motivation

I spent some time looking for a validation module that was simple, practical and light. All I found were modules that promise simplicity, but deliver complex APIs; they promise lightness, but deliver very heavy dependencies; promise practicality, but deliver ready-made functions that do not meet our needs, and it is necessary to download new modules and configure messages to change language and validation behavior.

So I wrote `valite`, unlike all of them, it's just the _core_ needed to build your validations. It is asynchronous by default, as everything should be in JavaScript, and has an extremely simple and concise API.

## Install

`valite` is published under NPM registry, so you can install from any package manager.

```sh
npm install valite --save

# Use this command for Yarn.
yarn add valite
```

## API

The API is composed by a validation function, `validate`, a validation object function `validateSchema` and `isValid` which is a simple error checker.

### `validate`

Receives a value and a list of validations and returns the first obtained message or `null` if all the validations pass.

```ts
async function validate (value: any, validators: Array<Validator> = []): Message;
```

### `validateSchema`

Receives an object and a validator schema and returns an error schema, this schema uses same properties as validator schema but their value are first obtained message or `null` if all the validations pass.

```ts
type ValidatorSchema = { [property: string]: Validator[] };

type MessageSchema <T extends ValidatorSchema> = { [property in keyof T]: Message; };

async function validateSchema <T extends ValidatorSchema> (object: object, schema: T): MessageSchema<T>;
```

### `isValid`

Check if `validate`/`validateSchema` payload has no errors.

```ts
function isValid (error: Message | MessageSchema<any>): boolean;
```

### `Validation`

A function that receives the value and returns `true` if it is valid and a non-empty `string` message if invalid. Validations can be asynchronous and in this case they resolve to `Promise<true | string>`.

```ts
type Validator = (value: any) => string | true | Promise<string | true>;
```

## Usage

```js
import { validate, isValid } from 'valite';

// ...

const validators = [
  (value) => !!value.trim() || 'E-Mail is a required.',
  (value) => /^.+@.+\..+$/.test(value) || 'E-Mail is invalid',
  async (value) => {
    const isRegistered = await isAlreadyRegistered(value);
    return !isRegistered || 'E-Mail is already registered.';
  }
];

document.querySelector('.send').addEventListener('click', async (e) => {
  const value = document.querySelector('.email').value;
  const error = await validate(value, validators);

  if (error) {
    alert(error);
    return;
  }

  await submitEMail(value);
});
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->

[license]: ./LICENSE.md
[ci]: https://travis-ci.org/VitorLuizC/valite
[ci-badge]: https://travis-ci.org/VitorLuizC/valite.svg?branch=master
