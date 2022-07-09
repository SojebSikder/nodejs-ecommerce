import { env } from "../system/util";
import dotenv from "dotenv";
dotenv.config();

export const mailConfig = {
  mailers: {
    smtp: {
      host: env("MAIL_HOST", "smtp.mailgun.org"),
      port: env("MAIL_PORT", 587),
      encryption: env("MAIL_ENCRYPTION", "tls"),
      username: env("MAIL_USERNAME"),
      password: env("MAIL_PASSWORD"),
    },
  },

  /**
   * from address
   *
   */
  from: {
    address: env("MAIL_FROM_ADDRESS", "hello@example.com"),
  },
};
