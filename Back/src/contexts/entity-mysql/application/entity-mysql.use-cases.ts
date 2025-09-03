import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IFindSchemasOptionsParams } from "../domain/interfaces/repository/find-schemas-options-params.interface";
import { FindEntityMysql } from "./use-cases/find-entity-mysql";

export class EntityMysqlUseCases {
  private readonly findEntityMysqlUseCase: FindEntityMysql;

  constructor(readonly appContext: IAppContext) {
    this.findEntityMysqlUseCase = new FindEntityMysql(appContext);
  }

  findSchemas(options?: IFindSchemasOptionsParams) {
    return this.findEntityMysqlUseCase.findSchemas(options);
  }

  findTablesRelationsBySchemas(schemas?: string[]) {
    return this.findEntityMysqlUseCase.findTablesRelationsBySchemas(schemas);
  }

  findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ) {
    return this.findEntityMysqlUseCase.findValueAnywhere(value, opts);
  }
}
