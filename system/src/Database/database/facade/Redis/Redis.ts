import { RedisAdapter } from "./RedisAdapter";

type Option = {
  host?: string;
  user?: string;
  port?: string;
  password?: string;
  dbname?: string;
  url?: string;
  connect?: boolean;
};
/**
 * Redis facade class.
 * @class Redis
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Redis {
  private static _config;
  private static redis = new RedisAdapter();

  public static async config(options: Option) {
    this._config = options;
  }

  public static async connect() {
    const redisAdapter = this.redis.config(this._config);
    return redisAdapter;
  }

  public static instance() {
    return this.redis.getInstance();
  }

  public static async set(key, value) {
    this.connect();
    const redisAdapter = await this.redis.set(key, value);
  }

  public static async get(key) {
    this.connect();
    const redisAdapter = await this.redis.get(key);
    return redisAdapter;
  }
}
