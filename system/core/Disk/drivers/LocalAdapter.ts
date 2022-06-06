import { IStorage } from "./iStorage";
import fs from "fs/promises";

/**
 * LocalAdapter for local file storage
 */
export class LocalAdapter implements IStorage {
  /**
   * root url for file storage
   */
  rootUrl: string;

  constructor(rootUrl: string) {
    this.rootUrl = rootUrl;
  }
  /**
   * get data
   * @param key
   */
  async get(key: string) {
    try {
      const data = await fs.readFile(`${this.rootUrl}/${key}`, {
        encoding: "utf8",
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * put data
   * @param key
   * @param value
   */
  async put(key: string, value: any) {
    try {
      await fs.writeFile(`${this.rootUrl}/${key}`, value);
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * delete data
   * @param key
   */
  async delete(key: string) {
    await fs.unlink(`${this.rootUrl}/${key}`);
  }
}

// module.exports = MySQLAdapter;
