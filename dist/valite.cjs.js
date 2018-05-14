/*!
 * valite v0.1.1
 * (c) 2018-present Vitor Luiz Cavalcanti <vitorluizc@outlook.com> (https://vitorluizc.github.io)
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ValidatorError = (function (Error) {
  function ValidatorError(message) {
    Error.call(this, message);
    this.name = 'ValidatorError';
    this.message = message;
  }

  if ( Error ) ValidatorError.__proto__ = Error;
  ValidatorError.prototype = Object.create( Error && Error.prototype );
  ValidatorError.prototype.constructor = ValidatorError;

  return ValidatorError;
}(Error));

function isMessage(message) {
  var isEmpty = typeof message === 'string' && !message.trim();
  var isWrong = message !== true && typeof message !== 'string';
  if (isWrong) { throw new ValidatorError('Should return true or a non-empty string.'); }
  if (isEmpty) { throw new ValidatorError('Empty validator message.'); }
  return message !== true;
}

function validate(value, validators) {
  if ( validators === void 0 ) validators = [];

  return new Promise(function ($return, $error) {
    var execute, messages, message;
    execute = function (validator) { return validator(value); };
    return Promise.resolve(Promise.all(validators.map(execute))).then(function ($await_1) {
      try {
        messages = $await_1;
        message = messages.find(isMessage) || null;
        return $return(message);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
}

exports.validate = validate;
exports.ValidatorError = ValidatorError;
exports.default = validate;
