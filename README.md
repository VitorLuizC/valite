# valite

[![Build Status][ci-badge]][ci]

I spent some time looking for a validation module that was simple, practical and light. All I found were modules that promise simplicity, but deliver complex APIs; they promise lightness, but deliver very heavy dependencies; promise practicality, but deliver ready-made functions that do not meet our needs, and it is necessary to download new modules and configure messages to change language and validation behavior.

So I wrote `valite`, unlike all of them, it's just the _core_ needed to build your validations. It is asynchronous by default, as everything should be in JavaScript, and has an extremely simple and concise API.

The API is composed by a validation function, `validate`,  that receives a value and a list of validations and returns the first obtained message or null if all the validations pass.

```ts
function validate (value: any, validators: Validator[] = []): Promise<string | null>;
```

Validations are functions that receives the value and returns `true` if it is valid and a non-empty `string` message if invalid. These validations can be asynchronous and in this case they resolve to `Promise<true | string>`.

```ts
type Validator = (value: any) => string | true | Promise<string | true>;
```

## Install

`valite` is published under NPM registry, so you can install from any JavaScript/Node package manager.

```sh
npm install valite --save
```

## Example

```js
import validate from 'valite';

const isLengthBetween = (min, max, message) => ({ length }) => {
  const isBetween = (length >= min && length <= max);
  return isBetween || message;
};

(async () => {
  const code = document.querySelector('.js-code-field').value;
  const error = await validate(code, [
    (value) => !!value.trim() || 'Code is required.',
    (value) => /\D/.test(value) || 'Code should be numeric.',
    isLengthBetween(4, 8, 'Code is not bewteen 4 and 8 digits.'),
  ]);

  if (error)
    alert(error);
})();
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->

[license]: ./LICENSE.md
[ci]: https://travis-ci.org/VitorLuizC/valite
[ci-badge]: https://travis-ci.org/VitorLuizC/valite.svg?branch=master
