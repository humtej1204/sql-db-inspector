import sql from "mssql";
import { AzureCliCredential } from "@azure/identity";
import { env } from "../../config/environments";
import { appConsole } from "../../utils/app-console";
import { errorHandler } from "../../../domain/error/error-handler";

export interface ISQLServerDB extends sql.ConnectionPool {}

export class SQLServer {
  public db?: ISQLServerDB;
  private config?: sql.config;

  async connect(): Promise<ISQLServerDB> {
    try {
      const config = await this.setConfig();
      const connection = await sql.connect(config);
      appConsole.log("Connecting to SQL Server...");

      this.db = connection;
      const result = await connection
        .request()
        .query("SELECT GETDATE() as currentTime");

      appConsole.log(
        "SQL Server database connected, Result:",
        result.recordset
      );

      return this.db;
    } catch (error) {
      appConsole.error("[SQLServer - connect]", error);
      throw errorHandler(error);
    }
  }

  async setConfig() {
    try {
      const cred = new AzureCliCredential();
      const scope = "https://database.windows.net/.default";
      const { token } = await cred.getToken(scope);

      this.config = {
        server: env.db.sqlServer.host,
        user: env.db.sqlServer.user,
        password: env.db.sqlServer.pass,
        database: env.db.sqlServer.name,
        options: {
          encrypt: env.db.sqlServer.options.encrypt,
          trustServerCertificate:
            env.db.sqlServer.options.trustServerCertificate,
        },
        authentication: {
          type: env.db.sqlServer.auth.type as any,
          options: { token },
        },
        requestTimeout: 0,
      };

      return this.config;
    } catch (error) {
      appConsole.error("[SQLServer - setConfig]", error);
      throw errorHandler(error);
    }
  }
}

export const sqlServerDB = new SQLServer();
