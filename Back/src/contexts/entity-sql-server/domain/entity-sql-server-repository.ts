export interface IEntitySqlServerRepository {
  findAllTables(): Promise<any>;
  findBaseTables(): Promise<any>;
  findTablesRelations(): Promise<any>;
  findTableRelationsByName(table: string, schema?: string): Promise<any>;
  findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ): Promise<any>;
}
