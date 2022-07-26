/**
 * Module decorator.
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 * @param param
 * @returns
 */
export function Module({ controllers }): Function {
  return function (object: Object, methodName: string) {};
}
