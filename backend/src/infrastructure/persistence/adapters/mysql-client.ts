/* eslint-disable @typescript-eslint/no-var-requires */
import mysql from 'mysql2';

export class MysqlClient {
  private client: mysql.Connection;

  constructor(
    host: string,
    port: string,
    username: string,
    password: string,
    database: string,
  ) {
    this.client = mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: username,
      password: password,
      database: database,
    });
    this.client.connect((err) => {
      if (err) {
        console.log('Error connecting to MySQL database', err);
        return;
      }
      console.log('Connected to MySQL database');
    });
  }

  static create(
    host: string,
    port: string,
    username: string,
    password: string,
    database: string,
  ): mysql.Connection {
    return new MysqlClient(host, port, username, password, database).client;
  }
}
