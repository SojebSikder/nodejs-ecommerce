import { env } from "../system/util";
import dotenv from "dotenv"
dotenv.config();

export const authConfig = {
  guards: {
    jwt: {
      secret: env("JWT_SECRET", "c0a7e53c6991d6c0917a942de9cec9ffeed228cc"),
      refresh_secret: env(
        "JWT_REFRESH_SECRET",
        "c0a7e53c6991d6c0917a942de9cec9ffeed228cc"
      ),
      expires: env("JWT_EXPIRY", "86400000"),
    },
  },
};
