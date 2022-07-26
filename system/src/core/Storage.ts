// import filesystemConfig from "../../config/filesystems";
import { filesystemConfig } from "../Config";
import { StorageClass } from "./Disk/StorageClass";
import { LocalAdapter } from "./Disk/drivers/LocalAdapter";

/**
 * Storage class for handling storage
 * @class Storage
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Storage {
  private static _instance: Storage;
  // Default filesystem disk
  public defaultDisk: string = filesystemConfig.default;

  /**
   * Create instance
   * @returns
   */
  public static instance(): Storage {
    if (!this._instance) {
      this._instance = new Storage();
    }
    return this._instance;
  }

  /**
   * Specify disk name
   * @param disk
   * @returns
   */
  public disk(disk: string): Storage {
    this.defaultDisk = disk;
    return this;
  }
  /**
   * store data
   * @param key
   * @param value
   * @returns
   */
  public put(key: string, value: any): Storage {
    const disk = this.storageDisk();
    return disk.put(key, value);
  }

  /**
   * read data
   * @param key
   * @returns
   */
  public async get(key: string) {
    const disk = this.storageDisk();
    return disk.get(key);
  }

  /**
   * delete data
   * @param key
   * @returns
   */
  public async delete(key: string) {
    const disk = this.storageDisk();
    return disk.delete(key);
  }

  /**
   * process storage disk type
   * @returns
   */
  private storageDisk() {
    const defaultDiskValue: string = this.defaultDisk;
    const driver: string = filesystemConfig.disks[defaultDiskValue].driver;
    const rootUrl: string = filesystemConfig.disks[defaultDiskValue].root;

    let driverAdapter;
    switch (driver) {
      // for local filesystem
      case "local":
        driverAdapter = new LocalAdapter(rootUrl);
        break;
        
      // case "s3":
      //   driverAdapter = new S3Adapter();
      //   break;

      default:
        driverAdapter = new LocalAdapter(rootUrl);
        break;
    }
    return new StorageClass(driverAdapter);
  }
}
