import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IFindTableRelationsByNameParams } from "../domain/interfaces/find-table-relations-by-name-params.interface";
import { IFindValueAnywhereOptionsParams } from "../domain/interfaces/find-values-anywhere-params.interface";
import { FindEntitySqlServer } from "./use-cases/find-entity-sql-server";

export class EntitySqlServerUseCases {
  private readonly findEntitySqlServerUseCase: FindEntitySqlServer;

  constructor(readonly appContext: IAppContext) {
    this.findEntitySqlServerUseCase = new FindEntitySqlServer(appContext);
  }

  connectDb(database: string) {
    return this.findEntitySqlServerUseCase.connectDb(database);
  }

  findDatabaseList() {
    return this.findEntitySqlServerUseCase.getDatabaseList();
  }

  findAllTables(database?: string) {
    return this.findEntitySqlServerUseCase.findAllTables(database);
  }

  findBaseTables(database?: string) {
    return this.findEntitySqlServerUseCase.findBaseTables(database);
  }

  findTablesRelations(database?: string) {
    return this.findEntitySqlServerUseCase.findTablesRelations(database);
  }

  findTableRelationsByName(params: IFindTableRelationsByNameParams) {
    return this.findEntitySqlServerUseCase.findTableRelationsByName(params);
  }

  async findValueAnywhere(
    value: string,
    opts: IFindValueAnywhereOptionsParams
  ): Promise<any> {
    return await this.findEntitySqlServerUseCase.findValueAnywhere(value, opts);
  }
}
