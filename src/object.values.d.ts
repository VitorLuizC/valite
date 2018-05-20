declare module 'object.values' {
  function getValues <T extends Object> (object: T): Array<T[keyof T]>;

  export default getValues;
}
