# valite

[![Build Status][ci-badge]][ci]

Concurrently execute your validators in a simple, practical and light validator engine.

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

The API is composed by a validation function, `validate`, a validation object function `validateObject` and `isValid` which is a simple error checker.

#### `Validator`

Validators are functions that receives a value and returns a message or `true`.

```js
const isName = (name) => Boolean(name.trim()) || 'Name shouldn\'t be empty.';
```

For TypeScript, `valite` exports `Validator` type to improve your code safety.

```ts
import { Validator } from 'valite';

const isName: Validator = (name: string) => Boolean(name.trim()) || 'Name shouldn\'t be empty.';
```

#### `validate`

Executes validators **concurrently** and returns first obtained message or `null`.

```js
const mail = 'hi@capiwara.com.br';

validate(mail, [
  (mail) => Boolean(mail.trim()) || 'Mail is required.',
  (mail) => /^.+@.+\..+$/.test(mail) || 'Mail is invalid',

  // You can use async validators.
  (mail) => (
    services.isMailRegistered(mail)
      .then((isRegistered) => isRegistered || 'Mail is already registered.')
      .catch(() => 'Can\'t even verify if mail is already registered.')
  )
]);
//=> Promise { 'E-Mail is already registered.' };
```

#### `validateObject`

Validates an `object` using validators from a schema and returns them in same structure.

> Structure supports _dot notation_ for deep properties.

```js
const entries = {
  answer: document.querySelector('.answer').checked,
  user: {
    mail: document.querySelector('.mail').value,
    password: document.querySelector('.password').value,
  }
};

validateObject(entries, {
  'answer': [
    (answer) => Boolean(answer) || 'Terms should be accepted.',
  ],
  'user.mail': [
    (mail) => Boolean(value.trim()) || 'E-Mail is required.',
  ],
  'user.password': [
    (password) => Boolean(password.trim()) || 'Password is required.',
  ]
});
//=> Promise {{
//     'answer': null,
//     'user.mail': 'E-Mail is required',
//     'user.password': null
//   }}
```

#### `isValid`

Is a easy way to check if `validate` / `validateObject` payload has no errors.

```js
const payload = await validateObject(/* ... */);

isValid(payload);
//=> true
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->

[license]: ./LICENSE.md
[ci]: https://travis-ci.org/VitorLuizC/valite
[ci-badge]: https://travis-ci.org/VitorLuizC/valite.svg?branch=master
