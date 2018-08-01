/**
 * A valite's validator error class.
 */
class ValidatorError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'ValidatorError';
    this.message = message;
  }
}

export default ValidatorError;
