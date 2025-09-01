import { IEnvApp } from "./env-application.interface";

export interface IEnvDB {
  mysql: Pick<IEnvDBConfig, "host" | "user" | "port" | "pass" | "name">;
  sqlServer: Pick<
    IEnvDBConfig,
    "host" | "user" | "pass" | "name" | "options" | "auth"
  >;
}

export interface IEnvDBConfig {
  name: string;
  host: string;
  user: string;
  port: number;
  db: number;
  pass: string;
  pool: TDBPool;
  options: TDBOptions;
  auth: TDBAuth;
}

export interface TDBPool {
  min: number;
  max: number;
}

export interface TDBOptions {
  encrypt: boolean;
  trustServerCertificate: boolean;
}

export interface TDBAuth {
  type: string;
}

interface EnvExternalServicesConfiguration {
  host?: string;
  apiKey?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IEnvServices {}

interface IEnvOthers {
  [key: string]: string;
}

export interface IEnvironments {
  stage: string;
  app: IEnvApp;
  db: IEnvDB;
  services: IEnvServices;
  externalServices: Record<string, EnvExternalServicesConfiguration>;
  others: IEnvOthers;
}
