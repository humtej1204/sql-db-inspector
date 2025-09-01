import { LANG } from "../../domain/services/lang.service";
import { IEnvironments } from "../interfaces/environments.interface";
import dotenv from "dotenv";

dotenv.config();

export const env: IEnvironments = {
  stage: String(process.env.STAGE),
  app: {
    name: process.env.APP_NAME!,
    port: Number(process.env.APP_PORT ?? 3000),
    defaultLang: process.env.APP_DEFAULT_LANG as LANG,
    apiKey: process.env.APP_API_KEY!,
  },
  db: {
    mysql: {
      host: String(process.env.DB_MYSQL_HOST),
      port: Number(process.env.DB_MYSQL_PORT),
      user: String(process.env.DB_MYSQL_USER),
      pass: String(process.env.DB_MYSQL_PASS),
      name: String(process.env.DB_MYSQL_NAME),
    },
    sqlServer: {
      host: String(process.env.DB_SQLSERV_HOST),
      user: String(process.env.DB_SQLSERV_USER),
      pass: String(process.env.DB_SQLSERV_PASS),
      name: String(process.env.DB_SQLSERV_NAME),
      options: {
        encrypt: Boolean(Number(process.env.DB_SQLSERV_OPTION_ENCRYPT)),
        trustServerCertificate: Boolean(
          Number(process.env.DB_SQLSERV_OPTION_TRUST_SERV_CERT)
        ),
      },
      auth: {
        type: String(process.env.DB_SQLSERV_AUTH_TYPE),
      },
    },
  },
  services: {},
  externalServices: {},
  others: {},
};
