import { StorageClass } from "./Disk/StorageClass";
import { LocalAdapter } from "./Disk/drivers/LocalAdapter";
import { DiskOption } from "./Disk/Option";
import { S3Adapter } from "./Disk/drivers/S3Adapter";

/**
 * Storage class for handling storage
 * @class Storage
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Storage {
  private static _config: DiskOption;

  /**
   * Storage configuration
   * @param config
   */
  public static config(config: DiskOption) {
    this._config = config;
  }

  /**
   * Returns configuration
   * @returns {DiskOption}
   */
  public static getConfig(): DiskOption {
    return this._config;
  }

  /**
   * Specify disk name
   * @param disk
   * @returns
   */
  public static disk(disk: string): Storage {
    this._config.driver = disk;
    return this;
  }
  /**
   * store data
   * @param key
   * @param value
   * @returns
   */
  public static async put(key: string, value: any) {
    const disk = this.storageDisk();
    return disk.put(key, value);
  }

  /**
   * get data url
   * @param key
   * @returns
   */
  public static async url(key: string) {
    const disk = this.storageDisk();
    return await disk.url(key);
  }

  /**
   * read data
   * @param key
   * @returns
   */
  public static async get(key: string) {
    const disk = this.storageDisk();
    return await disk.get(key);
  }

  /**
   * delete data
   * @param key
   * @returns
   */
  public static async delete(key: string) {
    const disk = this.storageDisk();
    return await disk.delete(key);
  }

  /**
   * process storage disk type
   * @returns
   */
  private static storageDisk() {
    const driver: string = this._config.driver;
    const config: DiskOption = this._config;

    let driverAdapter;
    switch (driver) {
      // for local filesystem
      case "local":
        driverAdapter = new LocalAdapter(config);
        break;

      case "s3":
        driverAdapter = new S3Adapter(config);
        break;

      default:
        driverAdapter = new LocalAdapter(config);
        break;
    }
    return new StorageClass(driverAdapter);
  }
}
