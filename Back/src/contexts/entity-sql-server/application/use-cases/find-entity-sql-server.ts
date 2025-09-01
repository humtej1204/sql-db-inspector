import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IEntitySqlServerRepository } from "../../domain/entity-sql-server-repository";

export class FindEntitySqlServer {
  private readonly entitySqlServerRepository: IEntitySqlServerRepository;

  constructor(private readonly context: IAppContext) {
    this.entitySqlServerRepository =
      this.context.repositories.entitySqlServerRepository;
  }

  async findAllTables(): Promise<any> {
    return await this.entitySqlServerRepository.findAllTables();
  }

  async findBaseTables(): Promise<any> {
    return await this.entitySqlServerRepository.findBaseTables();
  }

  async findTablesRelations(): Promise<any> {
    return await this.entitySqlServerRepository.findTablesRelations();
  }

  async findTableRelationsByName(table: string, schema?: string): Promise<any> {
    return await this.entitySqlServerRepository.findTableRelationsByName(
      table,
      schema
    );
  }

  async findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ): Promise<any> {
    return await this.entitySqlServerRepository.findValueAnywhere(value, opts);
  }
}
