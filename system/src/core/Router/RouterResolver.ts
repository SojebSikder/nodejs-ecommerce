import express, { Express } from "express";
import { RouterStorage } from "./RouterStorage";

// Initialize express router
const router = express.Router();
/**
 * RouterResolver used to resolve route
 * @class RouterResolver
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class RouterResolver {
  /**
   * Resolve router
   * @param app Express
   */
  public static resolve(app: Express) {
    const controller = RouterStorage.controllers;
    const action = RouterStorage.actions;

    for (const [controllerKey, controllerValue] of Object.entries(controller)) {
      for (const [methodKey, methodValue] of Object.entries(action)) {
        if (controllerValue.target == methodValue.target) {
          const controllerObject = new controllerValue.target();

          // if method has middleware
          if (methodValue.options != null) {
            let { middleware } = methodValue.options;
            // if controller has middleware
            if (controllerValue.options != null) {
              const cmid = controllerValue.options.middleware;
              middleware = middleware.concat(cmid);
            }
            router[methodValue.type](
              `${controllerValue.route}${methodValue.route}`,
              middleware,
              controllerObject[methodValue.method]
            );
          } else {
            // if controller has middleware
            if (controllerValue.options != null) {
              let middleware;
              const cmid = controllerValue.options.middleware;
              middleware = cmid;

              router[methodValue.type](
                `${controllerValue.route}${methodValue.route}`,
                middleware,
                controllerObject[methodValue.method]
              );
            } else {
              router[methodValue.type](
                `${controllerValue.route}${methodValue.route}`,
                controllerObject[methodValue.method]
              );
            }
          }

          app.use(router);
        }
      }
    }
  }
}
