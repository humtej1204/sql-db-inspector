import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IEntityMysqlRepository } from "../../domain/entity-mysql-repository";
import { IFindSchemasOptionsParams } from "../../domain/interfaces/repository/find-schemas-options-params.interface";

export class FindEntityMysql {
  private readonly entityMysqlRepository: IEntityMysqlRepository;

  constructor(private readonly context: IAppContext) {
    this.entityMysqlRepository =
      this.context.repositories.entityMysqlRepository;
  }

  async findSchemas(options?: IFindSchemasOptionsParams): Promise<any> {
    return await this.entityMysqlRepository.findSchemas(options);
  }

  async findTablesRelationsBySchemas(schemas?: string[]): Promise<any> {
    return await this.entityMysqlRepository.findTablesRelationsBySchemas(
      schemas
    );
  }

  async findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" }
  ): Promise<any> {
    return await this.entityMysqlRepository.findValueAnywhere(value, opts);
  }
}
