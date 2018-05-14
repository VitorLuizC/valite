import ValidatorError from './ValidatorError';
declare type Validator = (value: any) => string | true | Promise<string | true>;
declare function validate(value: any, validators?: Array<Validator>): Promise<string>;
export { validate, Validator, ValidatorError, validate as default };
