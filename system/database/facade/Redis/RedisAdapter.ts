import { createClient } from "redis";
// redis imports
import { dbConfig } from "../../../../config/database";

/**
 * Redis adapter class
 * @class RedisAdapter
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class RedisAdapter {
  public host = dbConfig.connection.redis.default.host;
  public username = dbConfig.connection.redis.default.username;
  public pass = dbConfig.connection.redis.default.password;
  public dbname = dbConfig.connection.redis.default.database;
  public port = dbConfig.connection.redis.default.port;

  public connection;
  public error;

  constructor() {
    this.connectDB();
  }

  public connectDB = async () => {
    // url: 'redis://alice:foobared@awesome.redis.server:6380'
    //redis[s]://[[username][:password]@][host][:port][/db-number]
    this.connection = createClient({
      url: `redis://${this.username}:${this.pass}@${this.host}:${this.port}`,
    });

    this.connection.on("error", (err) =>
      console.log("Redis Client Error", err)
    );

    await this.connection.connect();
  };

  /**
   * set key value pair
   * @param key
   * @param value
   * @returns
   */
  public async set(key, value) {
    return await this.connection.set(key, value);
  }

  /**
   * get key value pair
   * @param key
   * @returns
   */
  public async get(key) {
    return await this.connection.get(key);
  }
}
