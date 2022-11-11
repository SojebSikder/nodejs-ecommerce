import { MySQLAdapter } from "./database/drivers/MySQLAdapter";
import { Dbase } from "./database/Dbase";
import { Option } from "./Option";

/**
 * Builder
 */
export class Builder {
  protected db: Dbase;

  public table = "";
  private _driver = "";
  private _connection = {};

  constructor() {
    this.connection();
  }

  // Db Builder config
  config(options: Option) {
    this._driver = options.driver;
    this._connection = options.connection;
  }

  public connection() {
    this.db = this.DBSwitcher();
  }

  public DBSwitcher(toggle = false) {
    let dbsw, driver;
    if (toggle == false) {
      dbsw = this._driver;
    } else {
      dbsw = toggle;
    }

    switch (dbsw) {
      case "mysql":
        driver = new MySQLAdapter(this._connection);
        break;

      default:
        driver = new MySQLAdapter(this._connection);
        break;
    }
    this.db = new Dbase(driver);
    return this.db;
  }

  public create_table(table, if_not_exist = true, attributes = []) {
    let attr;
    if (if_not_exist == true) {
      attr = "";

      for (let i = 0; i < attributes.length; i++) {
        attr += attributes[i];
      }
      attr = attr.trim();
      const sql = `CREATE TABLE IF NOT EXISTS ${table} (${attr});`; //ENGINE = InnoDB
      this.db.insert(sql);

      this.table = table;

      return this;
    } else {
      attr = "";

      for (let i = 0; i < attributes.length; i++) {
        attr += attributes[i].key + " " + attributes[i].value + ",";
      }

      attr = attr.trim();
      const sql = `CREATE TABLE ${table} (${attr});`; //ENGINE = InnoDB
      this.db.insert(sql);

      this.table = table;

      return this;
    }
  }

  public alter_table(table, attributes = []) {
    for (var i = 0; i < attributes.length; i++) {
      const sql = `ALTER TABLE ${table} CHANGE ${attributes[i].key} ${attributes[i].value};`;
      this.db.insert(sql);
      this.table = table;
    }
    return this;
  }

  public dropIfExists(table) {
    const sql = `DROP TABLE IF EXISTS ${table}`;
    this.db.delete(sql);

    return this;
  }

  public drop(table) {
    const sql = `DROP TABLE ${table}`;
    this.db.delete(sql);

    return this;
  }

  public add_key(key, $primary = true) {
    if ($primary == true) {
      const sql = `ALTER TABLE ${this.table} CHANGE ${key} ${key} INT(11) NOT NULL AUTO_INCREMENT, add PRIMARY KEY (${key})`;
      this.db.update(sql);

      return this;
    }
  }
}
