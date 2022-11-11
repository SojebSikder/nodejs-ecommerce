import AWS from "aws-sdk";
import { IStorage } from "./iStorage";
import { DiskOption } from "../Option";

/**
 * S3Adapter for s3 bucket storage
 */
export class S3Adapter implements IStorage {
  private _config: DiskOption;
  private s3: AWS.S3;

  constructor(config: DiskOption) {
    this._config = config;
    this.s3 = new AWS.S3({
      accessKeyId: this._config.connection.awsAccessKeyId,
      secretAccessKey: this._config.connection.awsSecretAccessKey,
    });
  }

  /**
   * returns object url
   * 
   * https://[bucketname].s3.[region].amazonaws.com/[object]
   * @param key
   * @returns
   */
  url(key: string) {
    return `${this._config.connection.awsBucket}.s3.${this._config.connection.awsDefaultRegion}.amazonaws.com/${key}`;
  }

  /**
   * get data
   * @param key
   */
  async get(key: string) {
    try {
      var params = { Bucket: this._config.connection.awsBucket, Key: key };
      const data = this.s3.getObject(params).createReadStream();
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
      const upload = await this.s3
        .upload({
          Bucket: this._config.connection.awsBucket,
          Key: key,
          Body: value,
        })
        .promise();
      return upload;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * delete data
   * @param key
   */
  async delete(key: string) {
    try {
      var params = { Bucket: this._config.connection.awsBucket, Key: key };
      this.s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          return 0;
        } // error
        else {
          return 1;
        } // deleted
      });
    } catch (err) {
      console.log(err);
    }
  }
}
