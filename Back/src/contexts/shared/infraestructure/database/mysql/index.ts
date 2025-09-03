import mysql from "mysql2/promise";
import { env } from "../../config/environments";
import { appConsole } from "../../utils/app-console";
import { AzureCliCredential } from "@azure/identity";
import { errorHandler } from "../../../domain/error/error-handler";

export interface IMySQLDB extends mysql.Connection {}

export class MySQL {
  public db?: IMySQLDB;
  private config?: Record<string, any>;

  async connect(): Promise<IMySQLDB> {
    try {
      const config = await this.setConfig();
      const mysqlConnection = await mysql.createConnection(config);
      appConsole.log("Connecting to MySQL...");

      this.db = mysqlConnection;
      const [result] = await this.db.query("SELECT 1+1 as result");

      appConsole.log("[MySQL] MySQL database connected, Result:", result);

      return this.db;
    } catch (error) {
      appConsole.error("[MySQL - connect]", error);
      throw errorHandler(error);
    }
  }

  async setConfig() {
    try {
      const cred = new AzureCliCredential();
      const scope = "https://ossrdbms-aad.database.windows.net/.default";
      const { token, expiresOnTimestamp } = await cred.getToken(scope);

      this.config = {
        host: env.db.mysql.host,
        port: env.db.mysql.port,
        user: env.db.mysql.user,
        password: token,
        database: env.db.mysql.name,
        ssl: { minVersion: "TLSv1.2" as const },
        enableKeepAlive: true,
        authPlugins: {
          mysql_clear_password: () => () => Buffer.from(token),
        },
      };

      if (expiresOnTimestamp) {
        const mins = Math.round((expiresOnTimestamp - Date.now()) / 60000);
        appConsole.log(`[MySQL] Token AAD expira en ~${mins} minutos`);
      }

      return this.config;
    } catch (error) {
      appConsole.error("[MySQL - setConfig]", error);
      throw errorHandler(error);
    }
  }

  async refreshTokenAndReconnect(): Promise<void> {
    try {
      if (this.db) await this.db.end().catch(() => void 0);
      this.db = undefined;

      await this.connect();
      appConsole.log("[MySQL] Reconectado con token AAD fresco");
    } catch (err) {
      appConsole.error("[MySQL - refreshTokenAndReconnect]", err);
      throw err;
    }
  }
}

export const mysqlDB = new MySQL();
