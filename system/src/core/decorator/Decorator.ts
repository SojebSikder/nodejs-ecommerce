import { RouterStorage } from "../Router";

type RouteOption = {
  /**
   * define middlewares
   */
  middleware?: any[];
};

/**
 * Controller decorator.
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Controller(
  baseRoute: string = "/",
  options?: RouteOption
): Function {
  return function (object: Function) {
    RouterStorage.controllers.push({
      type: "default",
      target: object,
      route: baseRoute,
      options,
    });
  };
}

/**
 * Route handler (method) Decorator. Routes HTTP GET requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Get(route: string = "", options?: RouteOption): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "get",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}

/**
 * Route handler (method) Decorator. Routes HTTP DELETE requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Delete(route: string = "", options?: RouteOption): Function {
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

/**
 * Route handler (method) Decorator. Routes HTTP HEAD requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Head(route: string = "", options?: RouteOption): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "head",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}

/**
 * Route handler (method) Decorator. Routes HTTP PATCH requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Patch(route: string = "", options?: RouteOption): Function {
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

/**
 * Route handler (method) Decorator. Routes HTTP POST requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Post(route: string = "", options?: RouteOption): Function {
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

/**
 * Route handler (method) Decorator. Routes HTTP PUT requests to the specified path.
 * @param route
 * @param options
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function Put(route: string = "", options?: RouteOption): Function {
  return function (object: Object, methodName: string) {
    RouterStorage.actions.push({
      type: "put",
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
