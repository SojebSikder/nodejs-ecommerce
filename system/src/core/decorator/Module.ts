/**
 * Module decorator.
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Module({
  imports,
  controllers,
}: {
  imports?;
  controllers;
}): Function {
  return function (object: Object, methodName: string) {};
}
