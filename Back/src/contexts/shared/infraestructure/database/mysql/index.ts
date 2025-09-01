import mysql from "mysql2/promise";
import { env } from "../../config/environments";
import { appConsole } from "../../utils/app-console";

export interface IMySQLDB extends mysql.Connection {}

export class MySQL {
  public db?: IMySQLDB;
  private config: Record<string, any>;

  constructor() {
    this.config = {
      host: env.db.mysql.host,
      port: env.db.mysql.port,
      user: env.db.mysql.user,
      password: env.db.mysql.pass,
      database: env.db.mysql.name,
    };
  }

  async connect(): Promise<IMySQLDB> {
    try {
      const mysqlConnection = await mysql.createConnection(this.config);
      appConsole.log("Connecting to MySQL...");

      this.db = mysqlConnection;
      const [result] = await this.db.query("SELECT 1+1 as result");

      appConsole.log("MySQL database connected, Result:", result);

      return this.db;
    } catch (error) {
      appConsole.error("[MySQL - connect]", error);
      // throw errorHandler(error);
      return this.db!;
    }
  }
}

export const mysqlDB = new MySQL();
