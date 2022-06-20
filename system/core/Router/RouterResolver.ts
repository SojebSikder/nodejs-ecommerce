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

          // if controller has not route specified
          if (!controllerValue.route) {
            // if method has middleware
            if (methodValue.options != null) {
              const { middleware } = methodValue.options;
              router[methodValue.type](
                `${methodValue.route}`,
                middleware,
                controllerObject[methodValue.method]
              );
            } else {
              router[methodValue.type](
                `${methodValue.route}`,
                controllerObject[methodValue.method]
              );
            }
          } else {
            // if method has middleware
            if (methodValue.options != null) {
              const { middleware } = methodValue.options;
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

          // if controller has middleware
          // if (controllerValue.options != null) {
          //   const { middleware } = controllerValue.options || {};
          //   app.use(middleware, router);
          // }
          // // if method has middleware
          // if (methodValue.options != null) {
          //   const { middleware } = methodValue.options || {};
          //   app.use(middleware, router);
          // } else {
          //   app.use(router);
          // }
          app.use(router);
        }
      }
    }
  }
}
