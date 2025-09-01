import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { FindEntityMysql } from "./use-cases/find-entity-mysql";

export class EntityMysqlUseCases {
  private readonly findEntityMysqlUseCase: FindEntityMysql;

  constructor(readonly appContext: IAppContext) {
    this.findEntityMysqlUseCase = new FindEntityMysql(appContext);
  }

  findBaseTables() {
    return this.findEntityMysqlUseCase.findBaseTables();
  }

  findTablesRelations() {
    return this.findEntityMysqlUseCase.findTablesRelations();
  }

  findTableRelationsByName(tableName: string) {
    return this.findEntityMysqlUseCase.findTableRelationsByName(tableName);
  }
}
