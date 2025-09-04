import sql from "mssql";
import { AzureCliCredential } from "@azure/identity";
import { env } from "../../config/environments";
import { appConsole } from "../../utils/app-console";
import { errorHandler } from "../../../domain/error/error-handler";

export interface ISQLServerDB extends sql.ConnectionPool {}

export class SQLServer {
  private readonly connections = new Map<string, ISQLServerDB>();
  private readonly inflight = new Map<string, Promise<ISQLServerDB>>();
  private token?: string;
  private tokenExpiration?: number;

  async connect(database?: string): Promise<ISQLServerDB> {
    try {
      const dbName = database || env.db.sqlServer.name;

      const existing = this.connections.get(dbName);
      if (existing?.connected) return existing;

      const inFlight = this.inflight.get(dbName);
      if (inFlight) return inFlight;

      const promise = (async () => {
        const config = await this.buildConfig(dbName);
        const pool = await new sql.ConnectionPool(config).connect();
        appConsole.log("[SQLServer] Connecting to SQL Server...", dbName);

        const result = await pool
          .request()
          .query("SELECT GETDATE() as currentTime");

        appConsole.log(
          `[SQLServer] Conectado a ${dbName}, Result:`,
          result.recordset
        );

        this.connections.set(dbName, pool);
        this.inflight.delete(dbName);

        return pool;
      })();

      this.inflight.set(dbName, promise);
      return promise;
    } catch (error) {
      appConsole.error("[SQLServer - connect]", error);
      throw errorHandler(error);
    }
  }

  get isTokenExpirated() {
    return (this.tokenExpiration ?? 0) - Date.now() <= 0;
  }

  async getConnectionToken() {
    if (this.token && !this.isTokenExpirated) return this.token;

    const cred = new AzureCliCredential();
    const scope = "https://database.windows.net/.default";
    const { token, expiresOnTimestamp } = await cred.getToken(scope);
    this.token = token;
    this.tokenExpiration = expiresOnTimestamp;

    if (this.tokenExpiration) {
      const mins = Math.round((this.tokenExpiration - Date.now()) / 60000);
      appConsole.log(`[SQLServer] Token AAD expira en ~${mins} minutos`);
    }

    return this.token;
  }

  async buildConfig(database: string) {
    try {
      const token = await this.getConnectionToken();

      const config: sql.config = {
        server: env.db.sqlServer.host,
        user: env.db.sqlServer.user,
        password: env.db.sqlServer.pass,
        database: database,
        options: {
          encrypt: env.db.sqlServer.options.encrypt,
          trustServerCertificate:
            env.db.sqlServer.options.trustServerCertificate,
          cryptoCredentialsDetails: { minVersion: "TLSv1.2" },
          connectTimeout: 15000,
        },
        authentication: {
          type: env.db.sqlServer.auth.type as any,
          options: { token },
        },
        requestTimeout: 0,
        pool: { max: 12, min: 0, idleTimeoutMillis: 30000 },
      };

      return config;
    } catch (error) {
      appConsole.error("[SQLServer - setConfig]", error);
      throw errorHandler(error);
    }
  }

  async getConnection(database?: string): Promise<ISQLServerDB> {
    return this.connect(database);
  }

  async close(database: string) {
    const conn = this.connections.get(database);
    if (conn) {
      await conn.close();
      this.connections.delete(database);
      appConsole.log(`[SQLServer] Conexión cerrada a ${database}`);
    }
  }

  async closeAll() {
    await Promise.all([...this.connections.values()].map((c) => c.close()));
    this.connections.clear();
  }

  async refreshTokenAndReconnect(): Promise<void> {
    try {
      const targets = [...this.connections.keys()];

      await Promise.all(
        targets.map(async (dbName) => {
          const current = this.connections.get(dbName);
          if (current) {
            await current.close();
            this.connections.delete(dbName);
          }

          await this.connect(dbName);
          appConsole.log(
            `[SQLServer] Reconectado con token AAD fresco (${dbName})`
          );
        })
      );
    } catch (err) {
      appConsole.error("[SQLServer - refreshTokenAndReconnect]", err);
      throw err;
    }
  }
}

export const sqlServerDB = new SQLServer();
