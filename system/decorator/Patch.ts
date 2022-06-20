import { RouterStorage } from "../core";

// export function Patch(route?: RegExp, options?): Function;

// export function Patch(route?: string, options?): Function;

/**
 * Route handler (method) Decorator. Routes HTTP PATCH requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Patch(route?: string | RegExp, options?): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "patch",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
