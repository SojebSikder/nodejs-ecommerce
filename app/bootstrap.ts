import { System } from "../system/src/Config";
// config
import { appConfig } from "../config/app";
import { authConfig } from "../config/auth";
import { dbConfig } from "../config/database";
import filesystemConfig from "../config/filesystems";
import { mailConfig } from "../config/mail";
import { staticConfig } from "../config/static";
import { boot } from "../app/app";
import { routes } from "../routes/web";

export function bootstrap() {
  // set system config
  System.setAppConfig(appConfig);
  System.setAuthConfig(authConfig);
  System.setDbConfig(dbConfig);
  System.setFileSystemConfig(filesystemConfig);
  System.setMailConfig(mailConfig);
  System.setStaticConfig(staticConfig);
  System.setRoutes(routes);
  System.setBoot(boot);
}
