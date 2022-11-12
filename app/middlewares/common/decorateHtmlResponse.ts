import { Request, Response } from "express";
import { Auth } from "../../../system/src/core/Auth";
import { env } from "../../../system/src/util";
import { ShopService } from "../../controllers/shop/shop.service";

/**
 * Middleware for decorating HTML response.
 * @param page_title
 * @returns
 */
export function decorateHtmlResponse(page_title = null) {
  return function (req: Request, res: Response, next) {
    res.locals.html = true;
    if (page_title == null) {
      res.locals.title = `${env("APP_NAME")}`;
    } else {
      res.locals.title = `${page_title} - ${env("APP_NAME")}`;
    }

    const user = Auth.userByCookie(req.signedCookies);
    res.locals.loggedInUser = user;
    res.locals.errors = {};
    res.locals.data = {};
    res.locals.message = "";
    // let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    next();
  };
}

/**
 * Middleware for decorating HTML Search response.
 * @returns
 */
export function decorateHtmlSearchResponse() {
  return function (req: Request, res: Response, next) {
    res.locals.search = { q: null };

    next();
  };
}

/**
 * Middleware for get shop details for seller
 */
export function getShopDetails() {
  return async function (req, res, next) {
    const shop = await ShopService.getInstance().index({
      signedCookies: req.signedCookies,
      domain: req.subDomain,
    });
    res.locals.shopDetails = shop;
    next();
  };
}
