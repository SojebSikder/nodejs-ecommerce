import { IStorage } from "./drivers/iStorage";
export class StorageClass {
  protected adapter: IStorage;

  constructor(adapter: IStorage) {
    this.adapter = adapter;
  }

  /**
   * get data url
   * @param key
   * @returns
   */
  public async url(key: string) {
    return await this.adapter.url(key);
  }

  /**
   * read data
   * @param key
   * @returns
   */
  public async get(key: string) {
    return await this.adapter.get(key);
  }

  /**
   * store data
   * @param key
   * @param value
   * @returns
   */
  public async put(key: string, value: any) {
    return await this.adapter.put(key, value);
  }

  /**
   * delete data
   * @param key
   * @returns
   */
  public async delete(key: string) {
    return await this.adapter.delete(key);
  }
}
