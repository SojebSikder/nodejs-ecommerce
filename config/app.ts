import { env } from "../system/util";

export const appConfig = {
  port: env("PORT", "3000"),
};
