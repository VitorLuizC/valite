/**
 * A valite's validator error class.
 */
export default class ValidatorError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'ValidatorError';
    this.message = message;
  }
}
