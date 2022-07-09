import { env } from "../system/util";
import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  /**
   * Default database connection name
   */
  default: env("DB_CONNECTION", "mysql"),

  connection: {
    /**
     * Mysql database connection
     */
    mysql: {
      driver: "mysql",
      url: env("DATABASE_URL", null),
      host: env("DB_HOST", "127.0.0.1"),
      port: env("DB_PORT", "3306"),
      database: env("DB_DATABASE", "nodejs"),
      username: env("DB_USERNAME", "root"),
      password: env("DB_PASSWORD", ""),
    },

    pgsql: {
      driver: "pgsql",
      url: env("DATABASE_URL", null),
      host: env("DB_HOST", "127.0.0.1"),
      // port: env("DB_PORT", "5432"),
      port: env("DB_PORT", "3211"),
      database: env("DB_DATABASE", "nodejs"),
      username: env("DB_USERNAME", "root"),
      password: env("DB_PASSWORD", ""),
    },
    /**
     * Redis database connection (Use Redis using Redis static class)
     * example: Redis.get("key")
     */
    redis: {
      default: {
        url: env("REDIS_URL"),
        host: env("REDIS_HOST", "127.0.0.1"),
        username: env("REDIS_USERNAME", null),
        password: env("REDIS_PASSWORD", null),
        port: env("REDIS_PORT", "6379"),
        database: env("REDIS_DB", "0"),
      },

      cache: {
        url: env("REDIS_URL"),
        host: env("REDIS_HOST", "127.0.0.1"),
        username: env("REDIS_USERNAME", null),
        password: env("REDIS_PASSWORD", null),
        port: env("REDIS_PORT", "6379"),
        database: env("REDIS_CACHE_DB", "1"),
      },
    },
  },
};
