import { DB } from "../../database/facade/DB";
import {
  arrayToString,
  arrayToStringWithQ,
  inArray,
} from "../../helper/ArrayHelper";

export class ORM {
  /**
   * The table associated with the model.
   *
   * @var string
   */
  private table;

  private whereC = null;

  constructor(table = null) {
    if (table != null) {
      this.table = table;
    } else {
      this.table = this.constructor.name.toLowerCase();
    }
  }

  /**
   * where clause
   */
  public where(key, value) {
    if (this.whereC == null) {
      this.whereC = `where ${key} = '${value}'`;
    } else {
      this.whereC += ` and ${key} = '${value}'`;
    }
    return this;
  }

  /**
   * Or where clause
   */
  public orWhere(key, value) {
    if (this.whereC == null) {
      this.whereC = `where ${key} = '${value}'`;
    } else {
      this.whereC += ` or ${key} = '${value}'`;
    }
    return this;
  }

  /**
   * Fetch query data
   */
  public async get(columns = ["*"]) {
    const column = arrayToString(columns);
    const data = await DB.select(
      `select ${column} from ${this.table} ${this.whereC}`
    );

    return data;
  }
  /**
   * fetch all data
   */
  public async all(columns = ["*"]) {
    let column;
    if (Array.isArray(columns)) {
      column = arrayToString(columns);
    } else {
      column = columns;
    }
    const data = await DB.select(`select ${column} from ${this.table}`);
    return data;
  }

  /**
   * insert data
   */
  public async create(objectData = {}) {
    let keys, values;

    keys = arrayToString(Object.keys(objectData));
    values = arrayToStringWithQ(Object.values(objectData));

    const data = await DB.insert(
      `insert ${this.table} (${keys}) values (${values})`
    );
    return data;
  }

  /**
   * update data
   */
  public async update(objectData) {
    let keys = "";
    let values = "";
    let set = "";

    for (const [key, value] of Object.entries(objectData)) {
      keys += key + ",";
      values += "'" + value + "',";
      set += key + "='" + value + "',";
    }
    set = set.slice(0, -1);

    const data = DB.update(`update ${this.table} set ${set} ${this.whereC}`);
    return data;
  }

  /**
   * save query data
   */
  public async save() {
    const tableName = this.table;

    const propsToImplode = [];

    const properties = Reflect.ownKeys(this);

    for (const property of properties) {
      if (!inArray(property, ["table", "whereC"])) {
        propsToImplode[property] = this[property];
      }
    }

    /**
     * insert data
     */
    if (this.whereC == null) {
      let sqlQuery = "";

      const keys = arrayToString(Object.keys(propsToImplode));
      const values = arrayToStringWithQ(Object.values(propsToImplode));

      sqlQuery = `INSERT INTO  ${tableName} (${keys}) VALUES  (${values})`;

      const data = await DB.insert(sqlQuery);
      return data;
    }
    // update data
    else {
      let keys = "";
      let values = "";
      let set = "";

      for (const [key, value] of Object.entries(propsToImplode)) {
        keys += key + ",";
        values += "'" + value + "',";
        set += key + "='" + value + "',";
      }
      set = set.slice(0, -1);

      const data = await DB.update(
        `update ${tableName} set ${set} ${this.whereC}`
      );
      return data;
    }
  }

  /**
   * delete query data
   */
  public async delete() {
    const tableName = this.table;

    /**
     * delete data
     */
    if (this.whereC == null) {
      const sqlQuery = `DELETE FROM ${tableName}`;

      const data = await DB.delete(sqlQuery);
      return data;
    }
    // delete specific data
    else {
      const data = await DB.delete(`DELETE FROM ${tableName} ${this.whereC}`);
      return data;
    }
  }
}
