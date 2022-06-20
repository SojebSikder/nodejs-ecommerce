import { Model } from "../../core/Model";

/**
 * DB facade
 * @class DB
 * @extends {Model}
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class DB extends Model {
  /**
   *
   * @var DB
   */
  private static instance: DB;

  constructor() {
    super();
  }

  private static getInstance = (): DB => {
    if (this.instance === null) {
      this.instance = new DB();
    }
    return this.instance;
  };
  /**
   * Select query
   */
  public static select = async (query) => {
    return await new DB().db.select(query);
  };

  /**
   * SelectOne query
   */
  public static selectOne = async (query) => {
    return await new DB().db.selectOne(query);
  };

  /**
   * insert query
   */
  public static insert = async (query) => {
    return await new DB().db.insert(query);
  };

  /**
   * update query
   */
  public static update = async (query) => {
    return await new DB().db.update(query);
  };

  /**
   * delete query
   */
  public static delete = async (query) => {
    return await new DB().db.delete(query);
  };

  /**
   * Statement query
   */
  public static statement = async (query) => {
    return await new DB().db.statement(query);
  };
}
