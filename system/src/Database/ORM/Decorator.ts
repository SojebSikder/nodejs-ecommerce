import { ORMStorage } from "./ORMStorage";

/**
 * Column decorator
 * @param options
 * @returns
 */
export function column(options?): Function {
  return function (object: Object, methodName: string) {
    ORMStorage.properties.push({
      target: object.constructor,
      method: methodName,
      options,
    });
  };
}
export function belongsTo({
  relationTable,
  foreignKey, // defaults to userId
  localKey,
}): Function {
  return function (object: Object, methodName: string) {};
}
