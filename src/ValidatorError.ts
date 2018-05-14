class ValidatorError extends Error {
  constructor (message?: string) {
    super(message);
    this.name = 'ValidatorError';
  }
}

export default ValidatorError;
