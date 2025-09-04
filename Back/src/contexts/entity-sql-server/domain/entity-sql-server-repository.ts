import { IFindTableRelationsByNameParams } from "./interfaces/find-table-relations-by-name-params.interface";
import { IFindValueAnywhereOptionsParams } from "./interfaces/find-values-anywhere-params.interface";

export interface IEntitySqlServerRepository {
  executeQuery(query?: string, database?: string): Promise<any>;
  findAllTables(database?: string): Promise<any>;
  findBaseTables(database?: string): Promise<any>;
  findTablesRelations(database?: string): Promise<any>;
  findTableRelationsByName(
    params: IFindTableRelationsByNameParams
  ): Promise<any>;
  findValueAnywhere(
    value: string,
    opts: IFindValueAnywhereOptionsParams
  ): Promise<any>;
}
