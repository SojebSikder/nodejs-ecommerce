import jwt from "jsonwebtoken";
import createError from "http-errors";
import { env } from "../../../system/src/util";
import { ShopService } from "../../controllers/shop/shop.service";

// auth guard to protect routes that need authentication
export const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[env("COOKIE_NAME")];
      const decoded = jwt.verify(token, env("JWT_SECRET"));
      req.user = decoded;

      // pass user info to response locals
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          message: "Authentication failure!",
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({
        message: "Authetication failure!",
      });
    }
  }
};

// redirect already logged in user to home page
export const redirectLoggedIn = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
    next();
  } else {
    res.redirect("/");
  }
};

// guard to protect routes that need role based authorization
export function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, "You are not authorized to access this page!"));
      } else {
        res.status(401).json({
          message: "You are not authorized!",
        });
      }
    }
  };
}

// guard to protect routes that those have shop.
export function isSeller() {
  return async function (req, res, next) {
    const shop = await ShopService.getInstance().index({
      signedCookies: req.signedCookies,
      status: "approved",
    });
    if (shop && shop.ShopDetails.length > 0) {
      next();
    } else {
      if (res.locals.html) {
        next(createError(401, "You are not authorized to access this page!"));
      } else {
        res.status(401).json({
          message: "You are not authorized!",
        });
      }
    }
  };
}
