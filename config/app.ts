import { env } from "../system/util";
import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  port: env("PORT", "3000"),
  cookieName: env("COOKIE_NAME"),
  cookieSecret: env(
    "COOKIE_SECRET",
    "c0a4e53c6991d8c0917a942de9cec9ffeed227cc"
  ),
  /**
   * Application security.
   */
  security: {
    cors: {
      enable: true,
      options: {},
    },
    /**
     * Helmet helps you secure your Express apps by setting various HTTP headers.
     */
    helmet: {
      enable: false,
      options: {
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false,
      },
    },
  },
};
