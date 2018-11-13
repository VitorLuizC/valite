/**
 * A valite's validator error class.
 */
export default class ValidatorError extends Error {
  __proto__: Error;

  constructor (message: string) {
    super(message);
    this.name = 'ValidatorError';
    this.message = message;
    this.__proto__ = new.target.prototype;
  }
}
