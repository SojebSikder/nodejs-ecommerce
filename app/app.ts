// external imports
import { Express } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// internal imports
// middleware imports
import { appConfig } from "../config/app";
import { setUser } from "./middlewares/authorization";

/**
 * Use any middleware here
 */
export function boot(app: Express) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(appConfig.cookieSecret));
  // custom middleware here
  app.use(setUser());
}
