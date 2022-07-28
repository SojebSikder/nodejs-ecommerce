// external imports
import { Express } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// internal imports
// middleware imports
import { appConfig } from "../config/app";
import { authorization, setUser } from "./middlewares/authorization";
import { getShopDetails } from "./middlewares/common/decorateHtmlResponse";
import { isSeller } from "./middlewares/common/checkLogin";

/**
 * Use any middleware here
 */
export function boot(app: Express) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(appConfig.cookieSecret));
  // custom middleware here
  app.use(setUser());
  app.use("/seller", authorization(), isSeller(), getShopDetails());
}
