// Database option
export type Option = {
  /**
   * Set database driver
   */
  driver?: string;
  /**
   * Database connection config
   */
  connection: {
    host?: string;
    user?: string;
    password?: string;
    dbname?: string;
    databaseUrl?: string;
  };
};
