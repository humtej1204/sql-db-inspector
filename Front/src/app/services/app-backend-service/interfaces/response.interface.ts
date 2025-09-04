export interface IListDatabasesResponse {
  key: string;
  name: string;
}

export interface IGetAllTablesResponse {
  schema: string;
  table: string;
  name: string;
  rows: number;
}

export interface ITableRelation {
  foreignKey: string;
  key: string;
  fkName?: string;
}

export interface IGetBaseTablesResponse {
  schema: string;
  table: string;
  name: string;
  rows: number;
  fields: Array<{
    column: string;
    type: string;
  }>;
  relations: Array<{
    table: string;
    relations: ITableRelation[];
  }>;
}

export interface IGetTablesRelationsResponse {
  schema: string;
  table: string;
  name: string;
  rows: number;
  fields: Array<{
    column: string;
    type: string;
  }>;
  relationsIncoming: Array<{
    table: string;
    relations: ITableRelation[];
  }>;
  relationsOutgoing: Array<{
    table: string;
    relations: ITableRelation[];
  }>;
}

export interface IGetTableRelationsByNameResponse extends IGetBaseTablesResponse {}

export interface IFindValueAnywhereResponse {
  schema: string;
  table: string;
  name: string;
  columns: string[];
}
