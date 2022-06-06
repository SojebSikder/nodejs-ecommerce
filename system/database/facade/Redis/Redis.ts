import { RedisAdapter } from "./RedisAdapter";

export class Redis {
  constructor() {}
  public static async connect() {
    const redisAdapter = new RedisAdapter().connectDB();
    return redisAdapter;
  }
  public static async set(key, value) {
    this.connect();
    const redisAdapter = await new RedisAdapter().set(key, value);
  }
  public static async get(key) {
    this.connect();
    const redisAdapter = await new RedisAdapter().get(key);
    return redisAdapter;
  }
}
