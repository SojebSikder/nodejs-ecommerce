import { bootstrap } from "../../app/bootstrap";

type AppConfig = {
  port;
  cookieName;
  cookieSecret;
  /**
   * Application security.
   */
  security: {
    cors: {
      enable: true;
      options: {};
    };
    /**
     * Helmet helps you secure your Express apps by setting various HTTP headers.
     */
    helmet: {
      enable: true;
      options: {
        contentSecurityPolicy;
      };
    };
  };
};
type AuthConfig = {
  guards: {
    jwt: {
      secret;
      refresh_secret;
      expires;
    };
  };
};
type DbConfig = {
  /**
   * Default database connection name
   */
  default;

  connection: {
    /**
     * Mysql database connection
     */
    mysql: {
      driver;
      url;
      host;
      port;
      database;
      username;
      password;
    };

    pgsql: {
      driver;
      url;
      host;
      // port: env("DB_PORT", "5432"),
      port;
      database;
      username;
      password;
    };
    /**
     * Redis database connection (Use Redis using Redis static class)
     * example: Redis.get("key")
     */
    redis: {
      default: {
        url;
        host;
        username;
        password;
        port;
        database;
      };

      cache: {
        url;
        host;
        username;
        password;
        port;
        database;
      };
    };
  };
};
type FileSystemConfig = {
  default;
  disks: {
    // default disk
    local: {
      driver;
      root;
    };
  };
};
type MailConfig = {
  mailers: {
    smtp: {
      host;
      port;
      encryption;
      username;
      password;
    };
  };

  /**
   * from address
   *
   */
  from: {
    address;
  };
};
type StaticConfig = {
  staticDir;
  engine: {
    enable;
    viewEngine;
    viewsDir;
  };
};
type Routes = (app) => void;
type Boot = (app) => void;

/**
 * System config
 */
export class System {
  public static appConfig: AppConfig;
  public static authConfig: AuthConfig;
  public static dbConfig: DbConfig;
  public static filesystemConfig: FileSystemConfig;
  public static mailConfig: MailConfig;
  public static staticConfig: StaticConfig;
  public static routes: Routes;
  public static boot: Boot;

  static setAppConfig(appConfig) {
    this.appConfig = appConfig;
  }

  static setAuthConfig(authConfig) {
    this.authConfig = authConfig;
  }

  static setDbConfig(dbConfig) {
    this.dbConfig = dbConfig;
  }

  static setFileSystemConfig(filesystemConfig) {
    this.filesystemConfig = filesystemConfig;
  }

  static setMailConfig(mailConfig) {
    this.mailConfig = mailConfig;
  }

  static setStaticConfig(staticConfig) {
    this.staticConfig = staticConfig;
  }

  static setRoutes(routes) {
    this.routes = routes;
  }

  static setBoot(boot) {
    this.boot = boot;
  }
}

bootstrap();

// map config from outside of core
export const appConfig = System.appConfig;
export const authConfig = System.authConfig;
export const dbConfig = System.dbConfig;
export const filesystemConfig = System.filesystemConfig;
export const mailConfig = System.mailConfig;
export const staticConfig = System.staticConfig;
export const routes = System.routes;
export const boot = System.boot;
