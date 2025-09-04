export interface IJoinDataFromTablesParams {
  sql: {
    database: string;
    query: string;
    fk: string;
  };
  mysql: {
    query: string;
    fk: string;
  };
}
