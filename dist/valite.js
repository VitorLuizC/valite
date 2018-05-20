/*!
 * valite v0.3.1
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

    var toStr = Object.prototype.toString;

    var isArguments = function isArguments(value) {
    	var str = toStr.call(value);
    	var isArgs = str === '[object Arguments]';
    	if (!isArgs) {
    		isArgs = str !== '[object Array]' &&
    			value !== null &&
    			typeof value === 'object' &&
    			typeof value.length === 'number' &&
    			value.length >= 0 &&
    			toStr.call(value.callee) === '[object Function]';
    	}
    	return isArgs;
    };

    // modified from https://github.com/es-shims/es5-shim
    var has = Object.prototype.hasOwnProperty;
    var toStr$1 = Object.prototype.toString;
    var slice = Array.prototype.slice;

    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
    var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
    var dontEnums = [
    	'toString',
    	'toLocaleString',
    	'valueOf',
    	'hasOwnProperty',
    	'isPrototypeOf',
    	'propertyIsEnumerable',
    	'constructor'
    ];
    var equalsConstructorPrototype = function (o) {
    	var ctor = o.constructor;
    	return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
    	$console: true,
    	$external: true,
    	$frame: true,
    	$frameElement: true,
    	$frames: true,
    	$innerHeight: true,
    	$innerWidth: true,
    	$outerHeight: true,
    	$outerWidth: true,
    	$pageXOffset: true,
    	$pageYOffset: true,
    	$parent: true,
    	$scrollLeft: true,
    	$scrollTop: true,
    	$scrollX: true,
    	$scrollY: true,
    	$self: true,
    	$webkitIndexedDB: true,
    	$webkitStorageInfo: true,
    	$window: true
    };
    var hasAutomationEqualityBug = (function () {
    	/* global window */
    	if (typeof window === 'undefined') { return false; }
    	for (var k in window) {
    		try {
    			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
    				try {
    					equalsConstructorPrototype(window[k]);
    				} catch (e) {
    					return true;
    				}
    			}
    		} catch (e) {
    			return true;
    		}
    	}
    	return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (o) {
    	/* global window */
    	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
    		return equalsConstructorPrototype(o);
    	}
    	try {
    		return equalsConstructorPrototype(o);
    	} catch (e) {
    		return false;
    	}
    };

    var keysShim = function keys(object) {
    	var isObject = object !== null && typeof object === 'object';
    	var isFunction = toStr$1.call(object) === '[object Function]';
    	var isArguments$$1 = isArguments(object);
    	var isString = isObject && toStr$1.call(object) === '[object String]';
    	var theKeys = [];

    	if (!isObject && !isFunction && !isArguments$$1) {
    		throw new TypeError('Object.keys called on a non-object');
    	}

    	var skipProto = hasProtoEnumBug && isFunction;
    	if (isString && object.length > 0 && !has.call(object, 0)) {
    		for (var i = 0; i < object.length; ++i) {
    			theKeys.push(String(i));
    		}
    	}

    	if (isArguments$$1 && object.length > 0) {
    		for (var j = 0; j < object.length; ++j) {
    			theKeys.push(String(j));
    		}
    	} else {
    		for (var name in object) {
    			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
    				theKeys.push(String(name));
    			}
    		}
    	}

    	if (hasDontEnumBug) {
    		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

    		for (var k = 0; k < dontEnums.length; ++k) {
    			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
    				theKeys.push(dontEnums[k]);
    			}
    		}
    	}
    	return theKeys;
    };

    keysShim.shim = function shimObjectKeys() {
    	if (Object.keys) {
    		var keysWorksWithArguments = (function () {
    			// Safari 5.0 bug
    			return (Object.keys(arguments) || '').length === 2;
    		}(1, 2));
    		if (!keysWorksWithArguments) {
    			var originalKeys = Object.keys;
    			Object.keys = function keys(object) {
    				if (isArguments(object)) {
    					return originalKeys(slice.call(object));
    				} else {
    					return originalKeys(object);
    				}
    			};
    		}
    	} else {
    		Object.keys = keysShim;
    	}
    	return Object.keys || keysShim;
    };

    var objectKeys = keysShim;

    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;

    var foreach = function forEach (obj, fn, ctx) {
        if (toString.call(fn) !== '[object Function]') {
            throw new TypeError('iterator must be a function');
        }
        var l = obj.length;
        if (l === +l) {
            for (var i = 0; i < l; i++) {
                fn.call(ctx, obj[i], i, obj);
            }
        } else {
            for (var k in obj) {
                if (hasOwn.call(obj, k)) {
                    fn.call(ctx, obj[k], k, obj);
                }
            }
        }
    };

    var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

    var toStr$2 = Object.prototype.toString;

    var isFunction = function (fn) {
    	return typeof fn === 'function' && toStr$2.call(fn) === '[object Function]';
    };

    var arePropertyDescriptorsSupported = function () {
    	var obj = {};
    	try {
    		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            /* eslint-disable no-unused-vars, no-restricted-syntax */
            for (var _ in obj) { return false; }
            /* eslint-enable no-unused-vars, no-restricted-syntax */
    		return obj.x === obj;
    	} catch (e) { /* this is IE 8. */
    		return false;
    	}
    };
    var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

    var defineProperty = function (object, name, value, predicate) {
    	if (name in object && (!isFunction(predicate) || !predicate())) {
    		return;
    	}
    	if (supportsDescriptors) {
    		Object.defineProperty(object, name, {
    			configurable: true,
    			enumerable: false,
    			value: value,
    			writable: true
    		});
    	} else {
    		object[name] = value;
    	}
    };

    var defineProperties = function (object, map) {
    	var predicates = arguments.length > 2 ? arguments[2] : {};
    	var props = objectKeys(map);
    	if (hasSymbols) {
    		props = props.concat(Object.getOwnPropertySymbols(map));
    	}
    	foreach(props, function (name) {
    		defineProperty(object, name, map[name], predicates[name]);
    	});
    };

    defineProperties.supportsDescriptors = !!supportsDescriptors;

    var defineProperties_1 = defineProperties;

    /* eslint no-invalid-this: 1 */

    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var slice$1 = Array.prototype.slice;
    var toStr$3 = Object.prototype.toString;
    var funcType = '[object Function]';

    var implementation = function bind(that) {
        var target = this;
        if (typeof target !== 'function' || toStr$3.call(target) !== funcType) {
            throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice$1.call(arguments, 1);

        var bound;
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice$1.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice$1.call(arguments))
                );
            }
        };

        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

        if (target.prototype) {
            var Empty = function Empty() {};
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }

        return bound;
    };

    var functionBind = Function.prototype.bind || implementation;

    var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

    var isPrimitive = function isPrimitive(value) {
    	return value === null || (typeof value !== 'function' && typeof value !== 'object');
    };

    var fnToStr = Function.prototype.toString;

    var constructorRegex = /^\s*class /;
    var isES6ClassFn = function isES6ClassFn(value) {
    	try {
    		var fnStr = fnToStr.call(value);
    		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
    		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
    		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
    		return constructorRegex.test(spaceStripped);
    	} catch (e) {
    		return false; // not a function
    	}
    };

    var tryFunctionObject = function tryFunctionObject(value) {
    	try {
    		if (isES6ClassFn(value)) { return false; }
    		fnToStr.call(value);
    		return true;
    	} catch (e) {
    		return false;
    	}
    };
    var toStr$4 = Object.prototype.toString;
    var fnClass = '[object Function]';
    var genClass = '[object GeneratorFunction]';
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

    var isCallable = function isCallable(value) {
    	if (!value) { return false; }
    	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
    	if (hasToStringTag) { return tryFunctionObject(value); }
    	if (isES6ClassFn(value)) { return false; }
    	var strClass = toStr$4.call(value);
    	return strClass === fnClass || strClass === genClass;
    };

    var getDay = Date.prototype.getDay;
    var tryDateObject = function tryDateObject(value) {
    	try {
    		getDay.call(value);
    		return true;
    	} catch (e) {
    		return false;
    	}
    };

    var toStr$5 = Object.prototype.toString;
    var dateClass = '[object Date]';
    var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

    var isDateObject = function isDateObject(value) {
    	if (typeof value !== 'object' || value === null) { return false; }
    	return hasToStringTag$1 ? tryDateObject(value) : toStr$5.call(value) === dateClass;
    };

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var isSymbol = createCommonjsModule(function (module) {

    var toStr = Object.prototype.toString;
    var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

    if (hasSymbols) {
    	var symToStr = Symbol.prototype.toString;
    	var symStringRegex = /^Symbol\(.*\)$/;
    	var isSymbolObject = function isSymbolObject(value) {
    		if (typeof value.valueOf() !== 'symbol') { return false; }
    		return symStringRegex.test(symToStr.call(value));
    	};
    	module.exports = function isSymbol(value) {
    		if (typeof value === 'symbol') { return true; }
    		if (toStr.call(value) !== '[object Symbol]') { return false; }
    		try {
    			return isSymbolObject(value);
    		} catch (e) {
    			return false;
    		}
    	};
    } else {
    	module.exports = function isSymbol(value) {
    		// this environment does not support Symbols.
    		return false;
    	};
    }
    });

    var hasSymbols$1 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






    var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
    	if (typeof O === 'undefined' || O === null) {
    		throw new TypeError('Cannot call method on ' + O);
    	}
    	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
    		throw new TypeError('hint must be "string" or "number"');
    	}
    	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
    	var method, result, i;
    	for (i = 0; i < methodNames.length; ++i) {
    		method = O[methodNames[i]];
    		if (isCallable(method)) {
    			result = method.call(O);
    			if (isPrimitive(result)) {
    				return result;
    			}
    		}
    	}
    	throw new TypeError('No default value');
    };

    var GetMethod = function GetMethod(O, P) {
    	var func = O[P];
    	if (func !== null && typeof func !== 'undefined') {
    		if (!isCallable(func)) {
    			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
    		}
    		return func;
    	}
    };

    // http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
    var es6 = function ToPrimitive(input, PreferredType) {
    	if (isPrimitive(input)) {
    		return input;
    	}
    	var hint = 'default';
    	if (arguments.length > 1) {
    		if (PreferredType === String) {
    			hint = 'string';
    		} else if (PreferredType === Number) {
    			hint = 'number';
    		}
    	}

    	var exoticToPrim;
    	if (hasSymbols$1) {
    		if (Symbol.toPrimitive) {
    			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
    		} else if (isSymbol(input)) {
    			exoticToPrim = Symbol.prototype.valueOf;
    		}
    	}
    	if (typeof exoticToPrim !== 'undefined') {
    		var result = exoticToPrim.call(input, hint);
    		if (isPrimitive(result)) {
    			return result;
    		}
    		throw new TypeError('unable to convert exotic object to primitive');
    	}
    	if (hint === 'default' && (isDateObject(input) || isSymbol(input))) {
    		hint = 'string';
    	}
    	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
    };

    var _isNaN = Number.isNaN || function isNaN(a) {
    	return a !== a;
    };

    var $isNaN = Number.isNaN || function (a) { return a !== a; };

    var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

    var has$1 = Object.prototype.hasOwnProperty;
    var assign = function assign(target, source) {
    	if (Object.assign) {
    		return Object.assign(target, source);
    	}
    	for (var key in source) {
    		if (has$1.call(source, key)) {
    			target[key] = source[key];
    		}
    	}
    	return target;
    };

    var sign = function sign(number) {
    	return number >= 0 ? 1 : -1;
    };

    var mod = function mod(number, modulo) {
    	var remain = number % modulo;
    	return Math.floor(remain >= 0 ? remain : remain + modulo);
    };

    var isPrimitive$1 = function isPrimitive(value) {
    	return value === null || (typeof value !== 'function' && typeof value !== 'object');
    };

    var toStr$6 = Object.prototype.toString;





    // https://es5.github.io/#x8.12
    var ES5internalSlots = {
    	'[[DefaultValue]]': function (O, hint) {
    		var actualHint = hint || (toStr$6.call(O) === '[object Date]' ? String : Number);

    		if (actualHint === String || actualHint === Number) {
    			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
    			var value, i;
    			for (i = 0; i < methods.length; ++i) {
    				if (isCallable(O[methods[i]])) {
    					value = O[methods[i]]();
    					if (isPrimitive(value)) {
    						return value;
    					}
    				}
    			}
    			throw new TypeError('No default value');
    		}
    		throw new TypeError('invalid [[DefaultValue]] hint supplied');
    	}
    };

    // https://es5.github.io/#x9
    var es5 = function ToPrimitive(input, PreferredType) {
    	if (isPrimitive(input)) {
    		return input;
    	}
    	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
    };

    // https://es5.github.io/#x9
    var ES5 = {
    	ToPrimitive: es5,

    	ToBoolean: function ToBoolean(value) {
    		return !!value;
    	},
    	ToNumber: function ToNumber(value) {
    		return Number(value);
    	},
    	ToInteger: function ToInteger(value) {
    		var number = this.ToNumber(value);
    		if (_isNaN(number)) { return 0; }
    		if (number === 0 || !_isFinite(number)) { return number; }
    		return sign(number) * Math.floor(Math.abs(number));
    	},
    	ToInt32: function ToInt32(x) {
    		return this.ToNumber(x) >> 0;
    	},
    	ToUint32: function ToUint32(x) {
    		return this.ToNumber(x) >>> 0;
    	},
    	ToUint16: function ToUint16(value) {
    		var number = this.ToNumber(value);
    		if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
    		var posInt = sign(number) * Math.floor(Math.abs(number));
    		return mod(posInt, 0x10000);
    	},
    	ToString: function ToString(value) {
    		return String(value);
    	},
    	ToObject: function ToObject(value) {
    		this.CheckObjectCoercible(value);
    		return Object(value);
    	},
    	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
    		/* jshint eqnull:true */
    		if (value == null) {
    			throw new TypeError(optMessage || 'Cannot call method on ' + value);
    		}
    		return value;
    	},
    	IsCallable: isCallable,
    	SameValue: function SameValue(x, y) {
    		if (x === y) { // 0 === -0, but they are not identical.
    			if (x === 0) { return 1 / x === 1 / y; }
    			return true;
    		}
    		return _isNaN(x) && _isNaN(y);
    	},

    	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
    	Type: function Type(x) {
    		if (x === null) {
    			return 'Null';
    		}
    		if (typeof x === 'undefined') {
    			return 'Undefined';
    		}
    		if (typeof x === 'function' || typeof x === 'object') {
    			return 'Object';
    		}
    		if (typeof x === 'number') {
    			return 'Number';
    		}
    		if (typeof x === 'boolean') {
    			return 'Boolean';
    		}
    		if (typeof x === 'string') {
    			return 'String';
    		}
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
    	IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
    		if (this.Type(Desc) !== 'Object') {
    			return false;
    		}
    		var allowed = {
    			'[[Configurable]]': true,
    			'[[Enumerable]]': true,
    			'[[Get]]': true,
    			'[[Set]]': true,
    			'[[Value]]': true,
    			'[[Writable]]': true
    		};
    		// jscs:disable
    		for (var key in Desc) { // eslint-disable-line
    			if (src(Desc, key) && !allowed[key]) {
    				return false;
    			}
    		}
    		// jscs:enable
    		var isData = src(Desc, '[[Value]]');
    		var IsAccessor = src(Desc, '[[Get]]') || src(Desc, '[[Set]]');
    		if (isData && IsAccessor) {
    			throw new TypeError('Property Descriptors may not be both accessor and data descriptors');
    		}
    		return true;
    	},

    	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.1
    	IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
    		if (typeof Desc === 'undefined') {
    			return false;
    		}

    		if (!this.IsPropertyDescriptor(Desc)) {
    			throw new TypeError('Desc must be a Property Descriptor');
    		}

    		if (!src(Desc, '[[Get]]') && !src(Desc, '[[Set]]')) {
    			return false;
    		}

    		return true;
    	},

    	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.2
    	IsDataDescriptor: function IsDataDescriptor(Desc) {
    		if (typeof Desc === 'undefined') {
    			return false;
    		}

    		if (!this.IsPropertyDescriptor(Desc)) {
    			throw new TypeError('Desc must be a Property Descriptor');
    		}

    		if (!src(Desc, '[[Value]]') && !src(Desc, '[[Writable]]')) {
    			return false;
    		}

    		return true;
    	},

    	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.3
    	IsGenericDescriptor: function IsGenericDescriptor(Desc) {
    		if (typeof Desc === 'undefined') {
    			return false;
    		}

    		if (!this.IsPropertyDescriptor(Desc)) {
    			throw new TypeError('Desc must be a Property Descriptor');
    		}

    		if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
    			return true;
    		}

    		return false;
    	},

    	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.4
    	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
    		if (typeof Desc === 'undefined') {
    			return Desc;
    		}

    		if (!this.IsPropertyDescriptor(Desc)) {
    			throw new TypeError('Desc must be a Property Descriptor');
    		}

    		if (this.IsDataDescriptor(Desc)) {
    			return {
    				value: Desc['[[Value]]'],
    				writable: !!Desc['[[Writable]]'],
    				enumerable: !!Desc['[[Enumerable]]'],
    				configurable: !!Desc['[[Configurable]]']
    			};
    		} else if (this.IsAccessorDescriptor(Desc)) {
    			return {
    				get: Desc['[[Get]]'],
    				set: Desc['[[Set]]'],
    				enumerable: !!Desc['[[Enumerable]]'],
    				configurable: !!Desc['[[Configurable]]']
    			};
    		} else {
    			throw new TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
    		}
    	},

    	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.5
    	ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
    		if (this.Type(Obj) !== 'Object') {
    			throw new TypeError('ToPropertyDescriptor requires an object');
    		}

    		var desc = {};
    		if (src(Obj, 'enumerable')) {
    			desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
    		}
    		if (src(Obj, 'configurable')) {
    			desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
    		}
    		if (src(Obj, 'value')) {
    			desc['[[Value]]'] = Obj.value;
    		}
    		if (src(Obj, 'writable')) {
    			desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
    		}
    		if (src(Obj, 'get')) {
    			var getter = Obj.get;
    			if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
    				throw new TypeError('getter must be a function');
    			}
    			desc['[[Get]]'] = getter;
    		}
    		if (src(Obj, 'set')) {
    			var setter = Obj.set;
    			if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
    				throw new TypeError('setter must be a function');
    			}
    			desc['[[Set]]'] = setter;
    		}

    		if ((src(desc, '[[Get]]') || src(desc, '[[Set]]')) && (src(desc, '[[Value]]') || src(desc, '[[Writable]]'))) {
    			throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
    		}
    		return desc;
    	}
    };

    var es5$1 = ES5;

    var regexExec = RegExp.prototype.exec;
    var gOPD = Object.getOwnPropertyDescriptor;

    var tryRegexExecCall = function tryRegexExec(value) {
    	try {
    		var lastIndex = value.lastIndex;
    		value.lastIndex = 0;

    		regexExec.call(value);
    		return true;
    	} catch (e) {
    		return false;
    	} finally {
    		value.lastIndex = lastIndex;
    	}
    };
    var toStr$7 = Object.prototype.toString;
    var regexClass = '[object RegExp]';
    var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

    var isRegex = function isRegex(value) {
    	if (!value || typeof value !== 'object') {
    		return false;
    	}
    	if (!hasToStringTag$2) {
    		return toStr$7.call(value) === regexClass;
    	}

    	var descriptor = gOPD(value, 'lastIndex');
    	var hasLastIndexDataProperty = descriptor && src(descriptor, 'value');
    	if (!hasLastIndexDataProperty) {
    		return false;
    	}

    	return tryRegexExecCall(value);
    };

    var toStr$8 = Object.prototype.toString;
    var hasSymbols$2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
    var SymbolIterator = hasSymbols$2 ? Symbol.iterator : null;



    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;





    var parseInteger = parseInt;

    var arraySlice = functionBind.call(Function.call, Array.prototype.slice);
    var strSlice = functionBind.call(Function.call, String.prototype.slice);
    var isBinary = functionBind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
    var isOctal = functionBind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
    var regexExec$1 = functionBind.call(Function.call, RegExp.prototype.exec);
    var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
    var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
    var hasNonWS = functionBind.call(Function.call, RegExp.prototype.test, nonWSregex);
    var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
    var isInvalidHexLiteral = functionBind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

    // whitespace from: http://es5.github.io/#x15.5.4.20
    // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
    var ws = [
    	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
    	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
    	'\u2029\uFEFF'
    ].join('');
    var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
    var replace = functionBind.call(Function.call, String.prototype.replace);
    var trim = function (value) {
    	return replace(value, trimRegex, '');
    };





    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
    var ES6 = assign(assign({}, es5$1), {

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
    	Call: function Call(F, V) {
    		var args = arguments.length > 2 ? arguments[2] : [];
    		if (!this.IsCallable(F)) {
    			throw new TypeError(F + ' is not a function');
    		}
    		return F.apply(V, args);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
    	ToPrimitive: es6,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
    	// ToBoolean: ES5.ToBoolean,

    	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
    	ToNumber: function ToNumber(argument) {
    		var value = isPrimitive$1(argument) ? argument : es6(argument, Number);
    		if (typeof value === 'symbol') {
    			throw new TypeError('Cannot convert a Symbol value to a number');
    		}
    		if (typeof value === 'string') {
    			if (isBinary(value)) {
    				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
    			} else if (isOctal(value)) {
    				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
    			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
    				return NaN;
    			} else {
    				var trimmed = trim(value);
    				if (trimmed !== value) {
    					return this.ToNumber(trimmed);
    				}
    			}
    		}
    		return Number(value);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
    	// ToInteger: ES5.ToNumber,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
    	// ToInt32: ES5.ToInt32,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
    	// ToUint32: ES5.ToUint32,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
    	ToInt16: function ToInt16(argument) {
    		var int16bit = this.ToUint16(argument);
    		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
    	// ToUint16: ES5.ToUint16,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
    	ToInt8: function ToInt8(argument) {
    		var int8bit = this.ToUint8(argument);
    		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
    	ToUint8: function ToUint8(argument) {
    		var number = this.ToNumber(argument);
    		if (_isNaN(number) || number === 0 || !_isFinite(number)) { return 0; }
    		var posInt = sign(number) * Math.floor(Math.abs(number));
    		return mod(posInt, 0x100);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
    	ToUint8Clamp: function ToUint8Clamp(argument) {
    		var number = this.ToNumber(argument);
    		if (_isNaN(number) || number <= 0) { return 0; }
    		if (number >= 0xFF) { return 0xFF; }
    		var f = Math.floor(argument);
    		if (f + 0.5 < number) { return f + 1; }
    		if (number < f + 0.5) { return f; }
    		if (f % 2 !== 0) { return f + 1; }
    		return f;
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
    	ToString: function ToString(argument) {
    		if (typeof argument === 'symbol') {
    			throw new TypeError('Cannot convert a Symbol value to a string');
    		}
    		return String(argument);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
    	ToObject: function ToObject(value) {
    		this.RequireObjectCoercible(value);
    		return Object(value);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
    	ToPropertyKey: function ToPropertyKey(argument) {
    		var key = this.ToPrimitive(argument, String);
    		return typeof key === 'symbol' ? key : this.ToString(key);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    	ToLength: function ToLength(argument) {
    		var len = this.ToInteger(argument);
    		if (len <= 0) { return 0; } // includes converting -0 to +0
    		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
    		return len;
    	},

    	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
    	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
    		if (toStr$8.call(argument) !== '[object String]') {
    			throw new TypeError('must be a string');
    		}
    		if (argument === '-0') { return -0; }
    		var n = this.ToNumber(argument);
    		if (this.SameValue(this.ToString(n), argument)) { return n; }
    		return void 0;
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
    	RequireObjectCoercible: es5$1.CheckObjectCoercible,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
    	IsArray: Array.isArray || function IsArray(argument) {
    		return toStr$8.call(argument) === '[object Array]';
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
    	// IsCallable: ES5.IsCallable,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
    	IsConstructor: function IsConstructor(argument) {
    		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
    	IsExtensible: function IsExtensible(obj) {
    		if (!Object.preventExtensions) { return true; }
    		if (isPrimitive$1(obj)) {
    			return false;
    		}
    		return Object.isExtensible(obj);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
    	IsInteger: function IsInteger(argument) {
    		if (typeof argument !== 'number' || _isNaN(argument) || !_isFinite(argument)) {
    			return false;
    		}
    		var abs = Math.abs(argument);
    		return Math.floor(abs) === abs;
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
    	IsPropertyKey: function IsPropertyKey(argument) {
    		return typeof argument === 'string' || typeof argument === 'symbol';
    	},

    	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
    	IsRegExp: function IsRegExp(argument) {
    		if (!argument || typeof argument !== 'object') {
    			return false;
    		}
    		if (hasSymbols$2) {
    			var isRegExp = argument[Symbol.match];
    			if (typeof isRegExp !== 'undefined') {
    				return es5$1.ToBoolean(isRegExp);
    			}
    		}
    		return isRegex(argument);
    	},

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
    	// SameValue: ES5.SameValue,

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
    	SameValueZero: function SameValueZero(x, y) {
    		return (x === y) || (_isNaN(x) && _isNaN(y));
    	},

    	/**
    	 * 7.3.2 GetV (V, P)
    	 * 1. Assert: IsPropertyKey(P) is true.
    	 * 2. Let O be ToObject(V).
    	 * 3. ReturnIfAbrupt(O).
    	 * 4. Return O.[[Get]](P, V).
    	 */
    	GetV: function GetV(V, P) {
    		// 7.3.2.1
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    		}

    		// 7.3.2.2-3
    		var O = this.ToObject(V);

    		// 7.3.2.4
    		return O[P];
    	},

    	/**
    	 * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
    	 * 1. Assert: IsPropertyKey(P) is true.
    	 * 2. Let func be GetV(O, P).
    	 * 3. ReturnIfAbrupt(func).
    	 * 4. If func is either undefined or null, return undefined.
    	 * 5. If IsCallable(func) is false, throw a TypeError exception.
    	 * 6. Return func.
    	 */
    	GetMethod: function GetMethod(O, P) {
    		// 7.3.9.1
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    		}

    		// 7.3.9.2
    		var func = this.GetV(O, P);

    		// 7.3.9.4
    		if (func == null) {
    			return void 0;
    		}

    		// 7.3.9.5
    		if (!this.IsCallable(func)) {
    			throw new TypeError(P + 'is not a function');
    		}

    		// 7.3.9.6
    		return func;
    	},

    	/**
    	 * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
    	 * 1. Assert: Type(O) is Object.
    	 * 2. Assert: IsPropertyKey(P) is true.
    	 * 3. Return O.[[Get]](P, O).
    	 */
    	Get: function Get(O, P) {
    		// 7.3.1.1
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(O) is not Object');
    		}
    		// 7.3.1.2
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    		}
    		// 7.3.1.3
    		return O[P];
    	},

    	Type: function Type(x) {
    		if (typeof x === 'symbol') {
    			return 'Symbol';
    		}
    		return es5$1.Type(x);
    	},

    	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
    	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(O) is not Object');
    		}
    		var C = O.constructor;
    		if (typeof C === 'undefined') {
    			return defaultConstructor;
    		}
    		if (this.Type(C) !== 'Object') {
    			throw new TypeError('O.constructor is not an Object');
    		}
    		var S = hasSymbols$2 && Symbol.species ? C[Symbol.species] : void 0;
    		if (S == null) {
    			return defaultConstructor;
    		}
    		if (this.IsConstructor(S)) {
    			return S;
    		}
    		throw new TypeError('no constructor found');
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
    	CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
    		if (!this.IsPropertyDescriptor(Desc)) {
    			throw new TypeError('Desc must be a Property Descriptor');
    		}

    		if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
    			if (!src(Desc, '[[Value]]')) {
    				Desc['[[Value]]'] = void 0;
    			}
    			if (!src(Desc, '[[Writable]]')) {
    				Desc['[[Writable]]'] = false;
    			}
    		} else {
    			if (!src(Desc, '[[Get]]')) {
    				Desc['[[Get]]'] = void 0;
    			}
    			if (!src(Desc, '[[Set]]')) {
    				Desc['[[Set]]'] = void 0;
    			}
    		}
    		if (!src(Desc, '[[Enumerable]]')) {
    			Desc['[[Enumerable]]'] = false;
    		}
    		if (!src(Desc, '[[Configurable]]')) {
    			Desc['[[Configurable]]'] = false;
    		}
    		return Desc;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
    	Set: function Set(O, P, V, Throw) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('O must be an Object');
    		}
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('P must be a Property Key');
    		}
    		if (this.Type(Throw) !== 'Boolean') {
    			throw new TypeError('Throw must be a Boolean');
    		}
    		if (Throw) {
    			O[P] = V;
    			return true;
    		} else {
    			try {
    				O[P] = V;
    			} catch (e) {
    				return false;
    			}
    		}
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
    	HasOwnProperty: function HasOwnProperty(O, P) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('O must be an Object');
    		}
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('P must be a Property Key');
    		}
    		return src(O, P);
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-hasproperty
    	HasProperty: function HasProperty(O, P) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('O must be an Object');
    		}
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('P must be a Property Key');
    		}
    		return P in O;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
    	IsConcatSpreadable: function IsConcatSpreadable(O) {
    		if (this.Type(O) !== 'Object') {
    			return false;
    		}
    		if (hasSymbols$2 && typeof Symbol.isConcatSpreadable === 'symbol') {
    			var spreadable = this.Get(O, Symbol.isConcatSpreadable);
    			if (typeof spreadable !== 'undefined') {
    				return this.ToBoolean(spreadable);
    			}
    		}
    		return this.IsArray(O);
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-invoke
    	Invoke: function Invoke(O, P) {
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('P must be a Property Key');
    		}
    		var argumentsList = arraySlice(arguments, 2);
    		var func = this.GetV(O, P);
    		return this.Call(func, O, argumentsList);
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-getiterator
    	GetIterator: function GetIterator(obj, method) {
    		if (!hasSymbols$2) {
    			throw new SyntaxError('ES.GetIterator depends on native iterator support.');
    		}

    		var actualMethod = method;
    		if (arguments.length < 2) {
    			actualMethod = this.GetMethod(obj, SymbolIterator);
    		}
    		var iterator = this.Call(actualMethod, obj);
    		if (this.Type(iterator) !== 'Object') {
    			throw new TypeError('iterator must return an object');
    		}

    		return iterator;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-iteratornext
    	IteratorNext: function IteratorNext(iterator, value) {
    		var result = this.Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
    		if (this.Type(result) !== 'Object') {
    			throw new TypeError('iterator next must return an object');
    		}
    		return result;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete
    	IteratorComplete: function IteratorComplete(iterResult) {
    		if (this.Type(iterResult) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(iterResult) is not Object');
    		}
    		return this.ToBoolean(this.Get(iterResult, 'done'));
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue
    	IteratorValue: function IteratorValue(iterResult) {
    		if (this.Type(iterResult) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(iterResult) is not Object');
    		}
    		return this.Get(iterResult, 'value');
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-iteratorstep
    	IteratorStep: function IteratorStep(iterator) {
    		var result = this.IteratorNext(iterator);
    		var done = this.IteratorComplete(result);
    		return done === true ? false : result;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-iteratorclose
    	IteratorClose: function IteratorClose(iterator, completion) {
    		if (this.Type(iterator) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(iterator) is not Object');
    		}
    		if (!this.IsCallable(completion)) {
    			throw new TypeError('Assertion failed: completion is not a thunk for a Completion Record');
    		}
    		var completionThunk = completion;

    		var iteratorReturn = this.GetMethod(iterator, 'return');

    		if (typeof iteratorReturn === 'undefined') {
    			return completionThunk();
    		}

    		var completionRecord;
    		try {
    			var innerResult = this.Call(iteratorReturn, iterator, []);
    		} catch (e) {
    			// if we hit here, then "e" is the innerResult completion that needs re-throwing

    			// if the completion is of type "throw", this will throw.
    			completionRecord = completionThunk();
    			completionThunk = null; // ensure it's not called twice.

    			// if not, then return the innerResult completion
    			throw e;
    		}
    		completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
    		completionThunk = null; // ensure it's not called twice.

    		if (this.Type(innerResult) !== 'Object') {
    			throw new TypeError('iterator .return must return an object');
    		}

    		return completionRecord;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
    	CreateIterResultObject: function CreateIterResultObject(value, done) {
    		if (this.Type(done) !== 'Boolean') {
    			throw new TypeError('Assertion failed: Type(done) is not Boolean');
    		}
    		return {
    			value: value,
    			done: done
    		};
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-regexpexec
    	RegExpExec: function RegExpExec(R, S) {
    		if (this.Type(R) !== 'Object') {
    			throw new TypeError('R must be an Object');
    		}
    		if (this.Type(S) !== 'String') {
    			throw new TypeError('S must be a String');
    		}
    		var exec = this.Get(R, 'exec');
    		if (this.IsCallable(exec)) {
    			var result = this.Call(exec, R, [S]);
    			if (result === null || this.Type(result) === 'Object') {
    				return result;
    			}
    			throw new TypeError('"exec" method must return `null` or an Object');
    		}
    		return regexExec$1(R, S);
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate
    	ArraySpeciesCreate: function ArraySpeciesCreate(originalArray, length) {
    		if (!this.IsInteger(length) || length < 0) {
    			throw new TypeError('Assertion failed: length must be an integer >= 0');
    		}
    		var len = length === 0 ? 0 : length;
    		var C;
    		var isArray = this.IsArray(originalArray);
    		if (isArray) {
    			C = this.Get(originalArray, 'constructor');
    			// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
    			// if (this.IsConstructor(C)) {
    			// 	if C is another realm's Array, C = undefined
    			// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
    			// }
    			if (this.Type(C) === 'Object' && hasSymbols$2 && Symbol.species) {
    				C = this.Get(C, Symbol.species);
    				if (C === null) {
    					C = void 0;
    				}
    			}
    		}
    		if (typeof C === 'undefined') {
    			return Array(len);
    		}
    		if (!this.IsConstructor(C)) {
    			throw new TypeError('C must be a constructor');
    		}
    		return new C(len); // this.Construct(C, len);
    	},

    	CreateDataProperty: function CreateDataProperty(O, P, V) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(O) is not Object');
    		}
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    		}
    		var oldDesc = Object.getOwnPropertyDescriptor(O, P);
    		var extensible = oldDesc || (typeof Object.isExtensible !== 'function' || Object.isExtensible(O));
    		var immutable = oldDesc && (!oldDesc.writable || !oldDesc.configurable);
    		if (immutable || !extensible) {
    			return false;
    		}
    		var newDesc = {
    			configurable: true,
    			enumerable: true,
    			value: V,
    			writable: true
    		};
    		Object.defineProperty(O, P, newDesc);
    		return true;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow
    	CreateDataPropertyOrThrow: function CreateDataPropertyOrThrow(O, P, V) {
    		if (this.Type(O) !== 'Object') {
    			throw new TypeError('Assertion failed: Type(O) is not Object');
    		}
    		if (!this.IsPropertyKey(P)) {
    			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    		}
    		var success = this.CreateDataProperty(O, P, V);
    		if (!success) {
    			throw new TypeError('unable to create data property');
    		}
    		return success;
    	},

    	// http://ecma-international.org/ecma-262/6.0/#sec-advancestringindex
    	AdvanceStringIndex: function AdvanceStringIndex(S, index, unicode) {
    		if (this.Type(S) !== 'String') {
    			throw new TypeError('Assertion failed: Type(S) is not String');
    		}
    		if (!this.IsInteger(index)) {
    			throw new TypeError('Assertion failed: length must be an integer >= 0 and <= (2**53 - 1)');
    		}
    		if (index < 0 || index > MAX_SAFE_INTEGER) {
    			throw new RangeError('Assertion failed: length must be an integer >= 0 and <= (2**53 - 1)');
    		}
    		if (this.Type(unicode) !== 'Boolean') {
    			throw new TypeError('Assertion failed: Type(unicode) is not Boolean');
    		}
    		if (!unicode) {
    			return index + 1;
    		}
    		var length = S.length;
    		if ((index + 1) >= length) {
    			return index + 1;
    		}
    		var first = S.charCodeAt(index);
    		if (first < 0xD800 || first > 0xDBFF) {
    			return index + 1;
    		}
    		var second = S.charCodeAt(index + 1);
    		if (second < 0xDC00 || second > 0xDFFF) {
    			return index + 1;
    		}
    		return index + 2;
    	}
    });

    delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

    var es2015 = ES6;

    var ES2016 = assign(assign({}, es2015), {
    	// https://github.com/tc39/ecma262/pull/60
    	SameValueNonNumber: function SameValueNonNumber(x, y) {
    		if (typeof x === 'number' || typeof x !== typeof y) {
    			throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
    		}
    		return this.SameValue(x, y);
    	}
    });

    var es2016 = ES2016;

    var es7 = es2016;

    var isEnumerable$1 = functionBind.call(Function.call, Object.prototype.propertyIsEnumerable);

    var implementation$1 = function entries(O) {
    	var obj = es7.RequireObjectCoercible(O);
    	var entrys = [];
    	for (var key in obj) {
    		if (src(obj, key) && isEnumerable$1(obj, key)) {
    			entrys.push([key, obj[key]]);
    		}
    	}
    	return entrys;
    };

    var polyfill = function getPolyfill() {
    	return typeof Object.entries === 'function' ? Object.entries : implementation$1;
    };

    var shim = function shimEntries() {
    	var polyfill$$1 = polyfill();
    	defineProperties_1(Object, { entries: polyfill$$1 }, {
    		entries: function testEntries() {
    			return Object.entries !== polyfill$$1;
    		}
    	});
    	return polyfill$$1;
    };

    var polyfill$1 = polyfill();

    defineProperties_1(polyfill$1, {
    	getPolyfill: polyfill,
    	implementation: implementation$1,
    	shim: shim
    });

    var object_entries = polyfill$1;

    var isEnumerable$2 = functionBind.call(Function.call, Object.prototype.propertyIsEnumerable);

    var implementation$2 = function values(O) {
    	var obj = es7.RequireObjectCoercible(O);
    	var vals = [];
    	for (var key in obj) {
    		if (src(obj, key) && isEnumerable$2(obj, key)) {
    			vals.push(obj[key]);
    		}
    	}
    	return vals;
    };

    var polyfill$2 = function getPolyfill() {
    	return typeof Object.values === 'function' ? Object.values : implementation$2;
    };

    var shim$1 = function shimValues() {
    	var polyfill = polyfill$2();
    	defineProperties_1(Object, { values: polyfill }, {
    		values: function testValues() {
    			return Object.values !== polyfill;
    		}
    	});
    	return polyfill;
    };

    var polyfill$3 = polyfill$2();

    defineProperties_1(polyfill$3, {
    	getPolyfill: polyfill$2,
    	implementation: implementation$2,
    	shim: shim$1
    });

    var object_values = polyfill$3;

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
        return Promise.resolve(Promise.all(object_entries(schema).map(execute))).then(function ($await_4) {
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

      var isValid = !object_values(error).some(isError);
      return isValid;
    }

    exports.isValid = isValid;
    exports.validate = validate;
    exports.ValidatorError = ValidatorError;
    exports.validateProperties = validateProperties;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
