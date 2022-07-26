import { IStorage } from "./drivers/iStorage";
export class StorageClass {
  protected adapter: IStorage;

  constructor(adapter: IStorage) {
    this.adapter = adapter;
  }

  /**
   * read data
   * @param key
   * @returns
   */
  public get(key: string) {
    return this.adapter.get(key);
  }
  /**
   * store data
   * @param key
   * @param value
   * @returns
   */
  public put(key: string, value: any) {
    return this.adapter.put(key, value);
  }
  /**
   * delete data
   * @param key
   * @returns
   */
  delete(key: string) {
    return this.adapter.delete(key);
  }
}
