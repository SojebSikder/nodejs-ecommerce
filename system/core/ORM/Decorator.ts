import { ORMStorage } from "./ORMStorage";

/**
 * Column decorator
 * @param options
 * @returns
 */
export function column(options?): Function {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    ORMStorage.column.push({
      target: target.constructor,
      method: propertyKey,
      options,
    });
  };
}
// export function column(options?): Function {
//   return function (object: Object, methodName: string) {
//     ORMStorage.column.push({
//       target: object.constructor,
//       method: methodName,
//       options,
//     });
//   };
// }

/**
 *
 * @param options
 * @returns
 */
export function belongsTo(options?): Function {
  return function (object: Object, methodName: string) {
    ORMStorage.relation.push({
      type: "belongsTo",
      target: object.constructor,
      method: methodName,
      options,
    });
  };
}
