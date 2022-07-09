import { dbConfig } from "../../../config/database";
import { MySQLAdapter } from "../../database/drivers/MySQLAdapter";
import { Dbase } from "../../database/Dbase";
import { PostgreSQLAdapter } from "../../database/drivers/PostgreSQLAdapter";
/**
 * Builder
 */
export class Builder {
  protected db: Dbase;

  public table = "";

  constructor() {
    this.connection();
  }

  public connection() {
    this.db = this.DBSwitcher();
  }

  public DBSwitcher($switch = false) {
    //$this->db = new Database();

    let dbsw, driver;
    if ($switch == false) {
      dbsw = dbConfig.connection[dbConfig["default"]]["driver"];
    } else {
      dbsw = $switch;
    }

    switch (dbsw) {
      case "mysql":
        driver = new MySQLAdapter();
        break;
      case "pgsql":
        driver = new PostgreSQLAdapter();
        break;

      default:
        driver = new MySQLAdapter();
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
