export interface IJoinDataFromTablesParams {
  sql?: IDatabaseParams;
  mysql?: IDatabaseParams;
}

export interface IDatabaseParams {
  query: string;
  fk: string;
}
