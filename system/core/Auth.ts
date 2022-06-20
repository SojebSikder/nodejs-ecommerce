import jwt from "jsonwebtoken";
import { appConfig } from "../../config/app";
import { authConfig } from "../../config/auth";

/**
 * Auth class
 * @class Auth
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Auth {
  constructor() {}

  /**
   * authToken middleware. using this authenticate using jwt token
   * @param req
   * @param res
   * @param next
   * @returns
   */
  static authToken(callback?, options?) {
    const [apiToken] = options || [];
    return (req, res, next) => {
      let token;
      if (apiToken) {
        token = apiToken;
      } else {
        const authHeader = req.headers["authorization"];
        token = authHeader && authHeader.split(" ")[1];
        if (token == null) return res.sendStatus(401);
      }

      jwt.verify(token, authConfig.guards.jwt.secret, (err, data) => {
        if (callback && typeof callback === "function") {
          callback(err, data, req, res);
        } else {
          console.log(err);
          if (err) return res.sendStatus(403);
          req.user = data;
        }

        next();
      });
    };
  }

  /**
   * Generate jwt access token
   * @param user
   * @returns
   */
  static generateAccessToken(user) {
    // generate token
    const token = jwt.sign(user, authConfig.guards.jwt.secret, {
      expiresIn: authConfig.guards.jwt.expires,
    });

    return token;
  }

  /**
   * Generate jwt refresh access token
   * @param user
   * @returns
   */
  static generateRefreshAccessToken(user) {
    // generate refresh token
    const token = jwt.sign(user, authConfig.guards.jwt.refresh_secret);

    return token;
  }

  /**
   * Get decoded data from cookie using jwt token
   * @returns
   */
  static userByCookie(signedCookies) {
    let cookies = Object.keys(signedCookies).length > 0 ? signedCookies : null;

    if (cookies) {
      try {
        const token = cookies[appConfig.cookieName];
        const decoded = jwt.verify(token, authConfig.guards.jwt.secret);

        return decoded;
      } catch (err) {
        return err;
      }
    } else {
      return null;
    }
  }
  /**
   * Get decoded data using jwt token
   * @returns
   */
  static user(apiToken?) {
    let token = apiToken || null;

    if (token) {
      try {
        const decoded = jwt.verify(token, authConfig.guards.jwt.secret);

        return decoded;
      } catch (err) {
        return err;
      }
    } else {
      return null;
    }
  }
}
