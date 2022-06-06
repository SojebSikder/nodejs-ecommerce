import { env } from "../system/util";

export const authConfig = {
  guards: {
    jwt: {
      secret: env("JWT_SECRET"),
      refresh_secret: env("JWT_REFRESH_SECRET"),
      expires: env("JWT_EXPIRY"),
    },
  },
};
