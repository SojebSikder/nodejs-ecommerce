import { Auth } from "../../../system";
import { env } from "../../../system/util";

/**
 * Middleware for decorating HTML response.
 * @param page_title 
 * @returns 
 */
export function decorateHtmlResponse(page_title = null) {
  return function (req, res, next) {
    res.locals.html = true;
    if (page_title == null) {
      res.locals.title = `${env("APP_NAME")}`;
    } else {
      res.locals.title = `${page_title} - ${env("APP_NAME")}`;
    }

    // res.locals.loggedInUser = {};
    const user = Auth.userByCookie(req.signedCookies);
    res.locals.loggedInUser = user;
    res.locals.errors = {};
    res.locals.data = {};
    next();
  };
}
