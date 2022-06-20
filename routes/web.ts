// external imports
import { Express, Request, Response } from "express";
// internal imports
// middleware
import { RouterResolver } from "../system";
import { AppModule } from "../app/controllers/app.module";

/**
 * Init all routes
 * @param {*} app
 */
export function routes(app: Express) {
  // Initialize modules
  new AppModule();
  // Initialize router
  RouterResolver.resolve(app);

  /**
   * User custom router here
   */
  // fallback route
  app.get("*", function (req: Request, res: Response) {
    res.render("404");
  });
}
