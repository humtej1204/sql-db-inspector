import { IFindSchemasOptionsParams } from "./interfaces/repository/find-schemas-options-params.interface";

export interface IEntityMysqlRepository {
  executeQuery(query?: string): Promise<any>;
  findSchemas(options?: IFindSchemasOptionsParams): Promise<any>;
  findTablesRelationsBySchemas(schemas?: string[]): Promise<any>;
  findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ): Promise<any>;
}
