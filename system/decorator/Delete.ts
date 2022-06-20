import { RouterStorage } from "../core";

// export function Delete(route?: RegExp, options?): Function;

// export function Delete(route?: string, options?): Function;

/**
 * Route handler (method) Decorator. Routes HTTP DELETE requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Delete(route?: string | RegExp, options?): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "delete",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
