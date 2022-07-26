import { Client } from "pg";

// import { dbConfig } from "../../../config/database";
import { dbConfig } from "../../../Config";
import { IAdapter } from "./iAdapter";

/**
 * PostgreSQL adapter class
 * @class PostgreSQLAdapter
 * @implements {IAdapter}
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class PostgreSQLAdapter implements IAdapter {
  public host = dbConfig.connection.pgsql.host;
  public user = dbConfig.connection.pgsql.username;
  public pass = dbConfig.connection.pgsql.password;
  public dbname = dbConfig.connection.pgsql.database;
  public port = dbConfig.connection.pgsql.port;

  public databaseUrl = dbConfig.connection.pgsql.url;

  public connection: Client;
  public error;

  constructor() {
    this.connectDB();
  }

  private connectDB = () => {
    try {
      if (this.databaseUrl == null) {
        this.connection = new Client({
          user: this.user,
          host: this.host,
          database: this.dbname,
          password: this.pass,
          port: this.port,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      } else {
        this.connection = new Client({
          connectionString: this.databaseUrl,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      }

      this.connection.connect();
      console.log("connection success");
    } catch (error) {
      console.log(error);
    }
  };

  // Select or Read data
  public async select(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) reject(err);
          if (result) {
            resolve(result.rows);
          } else {
            resolve(false);
          }
          this.connection.end();
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  // Select or Read data
  public selectOne(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) reject(err);
          if (result) {
            resolve(result.rows[0]);
          } else {
            resolve(false);
          }
          this.connection.end();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // // Insert data
  public insert(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);

          this.connection.end();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Update data
  public update(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);

          this.connection.end();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete data
  public delete(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);

          this.connection.end();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // query statement data
  public statement(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);

          this.connection.end();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
