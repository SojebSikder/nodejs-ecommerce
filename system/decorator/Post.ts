import { RouterStorage } from "../core";

// export function Post(route?: RegExp, options?): Function;

// export function Post(route?: string, options?): Function;

/**
 * Route handler (method) Decorator. Routes HTTP POST requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Post(route?: string | RegExp, options?): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "post",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
