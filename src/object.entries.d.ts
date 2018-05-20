declare module 'object.entries' {
  function getEntries <T extends Object> (object: T): Array<[ keyof T, T[keyof T]]>;

  export default getEntries;
}
