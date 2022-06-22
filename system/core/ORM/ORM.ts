import { DB } from "../../database/facade/DB";
import { ArrayHelper } from "../../helper/ArrayHelper";
import { ORMStorage } from "./ORMStorage";

/**
 * ORM class
 * @class ORM
 * @extends {DB}
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 * @example
 * import { ORM } from "../../system/core/ORM";
 * class Data extends ORM {
 *  title: string;
 *  text: string;
 * }
 * // Usage
 * const data = new Data();
 * data.title = "Hello World";
 * data.text = "This is a test";
 * await data.save();
 */
export class ORM {
  /**
   * The table associated with the model.
   *
   * @var string
   */
  private table;

  private whereC = null;
  /**
   * Egar loading relationship
   */
  private _with = null;

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
  public where(key, del, value) {
    if (this.whereC == null) {
      this.whereC = `where ${key} ${del} '${value}'`;
    } else {
      this.whereC += ` and ${key} ${del} '${value}'`;
    }
    return this;
  }

  /**
   * Or where clause
   */
  public orWhere(key, del, value) {
    if (this.whereC == null) {
      this.whereC = `where ${key} ${del} '${value}'`;
    } else {
      this.whereC += ` or ${key} ${del} '${value}'`;
    }
    return this;
  }

  /**
   * Eagar loading
   * @param relationTable
   * @param localKey
   * @param foreignKey
   * @returns
   */
  public with(relationTable, localKey = "id", foreignKey = "id") {
    if (this._with == null) {
      this._with = ` INNER JOIN ${relationTable} ${relationTable} ON ${this.table}.${localKey} = ${relationTable}.${foreignKey}`;
    } else {
      this._with += ` INNER JOIN ${relationTable} ${relationTable} ON ${this.table}.${localKey} = ${relationTable}.${foreignKey}`;
    }

    return this;
  }

  /**
   * Fetch query data
   */
  public async get(columns = ["*"]) {
    const column = ArrayHelper.arrayToString(columns);
    let query;
    if (this._with == null) {
      query = `select ${column} from ${this.table} ${this.whereC}`;
    } else {
      query = `select ${column} from ${this.table} ${this._with} ${this.whereC}`;
    }
    const data = await DB.select(query);
    return data;
  }

  /**
   * fetch all data
   */
  public async all(columns = ["*"]) {
    let column;
    if (Array.isArray(columns)) {
      column = ArrayHelper.arrayToString(columns);
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

    keys = ArrayHelper.arrayToString(Object.keys(objectData));
    values = ArrayHelper.arrayToStringWithQ(Object.values(objectData));

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
    // let properties;
    // const ormProperties = ORMStorage.column;
    // ormProperties.map((item) => {
    //   if (properties == null) {
    //     properties = item.method + ",";
    //   } else {
    //     properties += item.method + ",";
    //   }
    // });
    // properties = properties.split(",");
    // properties = properties.slice(0, -1);

    for (const property of properties) {
      if (!ArrayHelper.inArray(property, ["table", "whereC", "_with"])) {
        propsToImplode[property] = this[property];
      }
    }
    /**
     * insert data
     */
    if (this.whereC == null) {
      let sqlQuery = "";

      const keys = ArrayHelper.arrayToString(Object.keys(propsToImplode));
      const values = ArrayHelper.arrayToStringWithQ(
        Object.values(propsToImplode)
      );

      sqlQuery = `INSERT INTO ${tableName} (${keys}) VALUES  (${values})`;

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
