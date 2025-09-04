export interface IJoinDataFromTablesParams {
  sql?: IDatabaseParams;
  mysql?: IDatabaseParams;
}

export interface IDatabaseParams {
  query: string;
  fk: string;
  database?: string;
}

export interface IJoinDataParams {
  sql: IDataParams;
  mysql: IDataParams;
}

export interface IDataParams {
  result: any[];
  fk: string;
}
