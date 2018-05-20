/*!
 * valite v0.3.0
 * (c) 2018-present Vitor Luiz Cavalcanti <vitorluizc@outlook.com> (https://vitorluizc.github.io)
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.valite = {})));
}(this, (function (exports) { 'use strict';

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
        return Promise.resolve(Promise.all(validators.map(execute))).then(function ($await_2) {
          try {
            messages = $await_2;
            message = messages.find(isMessage) || null;
            return $return(message);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      });
    }

    function getProperty(object, property) {
      try {
        var get = new Function('object', ("return object." + property));
        return get(object);
      } catch (_) {
        return;
      }
    }

    function validateProperties(object, schema) {
      return new Promise(function ($return, $error) {
        var execute, errors;
        execute = function (ref) {
          var property = ref[0];
          var validators = ref[1];

          return new Promise(function ($return, $error) {
          var value;
          value = getProperty(object, property);
          return Promise.resolve(validate(value, validators)).then(function ($await_3) {
            var obj;

            try {
              return $return(( obj = {}, obj[property] = $await_3, obj));
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }, $error);
        });
        };
        return Promise.resolve(Promise.all(Object.entries(schema).map(execute))).then(function ($await_4) {
          try {
            errors = $await_4;
            return $return(Object.assign.apply(Object, [ {} ].concat( errors )));
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      });
    }

    function isValid(error) {
      if (error === null || typeof error !== 'object') { return !isMessage(error); }

      var isError = function (error) { return typeof error === 'string'; };

      var isValid = !Object.values(error).some(isError);
      return isValid;
    }

    exports.isValid = isValid;
    exports.validate = validate;
    exports.ValidatorError = ValidatorError;
    exports.validateProperties = validateProperties;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
