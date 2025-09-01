export interface IEntityMysqlRepository {
  findBaseTables(): Promise<any>;
  findTablesRelations(): Promise<any>;
  findTableRelationsByName(tableName: string): Promise<any>;
}
