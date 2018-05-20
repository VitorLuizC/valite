import ValidatorError from './ValidatorError';
declare type Validator = (value: any) => string | true | Promise<string | true>;
declare function validate(value: any, validators?: Array<Validator>): Promise<string>;
declare type ValidatorSchema = {
    [property: string]: Array<Validator>;
};
declare function validateProperties<T extends ValidatorSchema>(object: object, schema: T): Promise<{
    [property in keyof T]: string;
}>;
declare function isValid(error: string | {
    [property: string]: string;
}): boolean;
export { isValid, validate, Validator, ValidatorError, ValidatorSchema, validateProperties };
