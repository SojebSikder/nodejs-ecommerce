import { Builder } from "./Builder";
import { Dbase } from "./database/Dbase";
import { Sorm } from "./Sorm";

/**
 * Model class
 * @class Model
 * @extends {Builder}
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Model extends Builder {
  /**
   * db property
   */
  public static db: Dbase;

  constructor() {
    super();
    this.config(Sorm.getConfig());
    this.db = this.DBSwitcher();
  }

  /**
   * Switching database driver
   */
  public DBSwitch(toggle) {
    this.config(Sorm.getConfig());
    return this.DBSwitcher(toggle);
  }
}
