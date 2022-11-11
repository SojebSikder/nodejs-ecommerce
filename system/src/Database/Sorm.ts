import { Option } from "./Option";

/**
 * Sorm class - A simple ORM
 * @class Model
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class Sorm {
  private static _config;

  /**
   * Set database configuration
   * @param options
   */
  static config(options: Option) {
    this._config = options;
  }

  /**
   * Get database configuration
   * @returns
   */
  static getConfig() {
    return this._config;
  }
}
