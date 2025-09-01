import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { FindEntitySqlServer } from "./use-cases/find-entity-sql-server";

export class EntitySqlServerUseCases {
  private readonly findEntitySqlServerUseCase: FindEntitySqlServer;

  constructor(readonly appContext: IAppContext) {
    this.findEntitySqlServerUseCase = new FindEntitySqlServer(appContext);
  }

  findAllTables() {
    return this.findEntitySqlServerUseCase.findAllTables();
  }

  findBaseTables() {
    return this.findEntitySqlServerUseCase.findBaseTables();
  }

  findTablesRelations() {
    return this.findEntitySqlServerUseCase.findTablesRelations();
  }

  findTableRelationsByName(table: string, schema?: string) {
    return this.findEntitySqlServerUseCase.findTableRelationsByName(
      table,
      schema
    );
  }

  async findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ): Promise<any> {
    return await this.findEntitySqlServerUseCase.findValueAnywhere(value, opts);
  }
}
