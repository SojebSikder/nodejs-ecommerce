import { Builder } from "../core/Database/Builder";
import { Dbase } from "../database/Dbase";

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
    this.db = this.DBSwitcher();
  }

  /**
   * Switching database driver
   */
  public DBSwitch($switch = false) {
    return this.DBSwitcher($switch);
  }
}
