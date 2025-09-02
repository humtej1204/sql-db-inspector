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
      appConsole.log("[SQLServer] Connecting to SQL Server...");

      this.db = connection;
      const result = await connection
        .request()
        .query("SELECT GETDATE() as currentTime");

      appConsole.log(
        "[SQLServer] SQL Server database connected, Result:",
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
      const { token, expiresOnTimestamp } = await cred.getToken(scope);

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

      if (expiresOnTimestamp) {
        const mins = Math.round((expiresOnTimestamp - Date.now()) / 60000);
        appConsole.log(`[SQLServer] Token AAD expira en ~${mins} minutos`);
      }

      return this.config;
    } catch (error) {
      appConsole.error("[SQLServer - setConfig]", error);
      throw errorHandler(error);
    }
  }

  async refreshTokenAndReconnect(): Promise<void> {
    try {
      if (this.db?.connected) await this.db.close();

      await this.connect();
      appConsole.log("[SQLServer] Reconectado con token AAD fresco");
    } catch (err) {
      appConsole.error("[SQLServer - refreshTokenAndReconnect]", err);
      throw err;
    }
  }
}

export const sqlServerDB = new SQLServer();
