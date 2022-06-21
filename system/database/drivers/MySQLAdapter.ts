import mysql from "mysql";

import { dbConfig } from "../../../config/database";
import { IAdapter } from "./iAdapter";

/**
 * MySQL adapter class
 * @class MySQLAdapter
 * @implements {IAdapter}
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export class MySQLAdapter implements IAdapter {
  public host = dbConfig.connection.mysql.host;
  public user = dbConfig.connection.mysql.username;
  public pass = dbConfig.connection.mysql.password;
  public dbname = dbConfig.connection.mysql.database;

  public connection;
  public error;

  constructor() {
    this.connectDB();
  }

  private connectDB = () => {
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.pass,
      database: this.dbname,
    });

    this.connection.connect(function (err) {
      if (err) {
        this.error = err;
        throw err;
      }
    });
  };

  // Select or Read data
  public select = async (query) => {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, (err, result, fields) => {
          if (err) reject(err);
          if (result.length > 0) {
            resolve(result);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Select or Read data
  public selectOne(query) {
    // returns a promise
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(query, function (err, result) {
          if (err) {
            reject(err);
          }
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(false);
          }
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
        this.connection.query(query, function (err, result) {
          if (err) {
            reject(err);
          }
          resolve(result);
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
        this.connection.query(query, function (err, result) {
          if (err) reject(err);
          resolve(result);
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
        this.connection.query(query, function (err, result) {
          if (err) reject(err);
          resolve(result);
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
        this.connection.query(query, function (err, result) {
          if (err) resolve(err);
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
