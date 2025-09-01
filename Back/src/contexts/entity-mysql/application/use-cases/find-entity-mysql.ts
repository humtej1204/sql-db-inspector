import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IEntityMysqlRepository } from "../../domain/entity-mysql-repository";

export class FindEntityMysql {
  private readonly entityMysqlRepository: IEntityMysqlRepository;

  constructor(private readonly context: IAppContext) {
    this.entityMysqlRepository =
      this.context.repositories.entityMysqlRepository;
  }

  async findBaseTables(): Promise<any> {
    return await this.entityMysqlRepository.findBaseTables();
  }

  async findTablesRelations(): Promise<any> {
    return await this.entityMysqlRepository.findTablesRelations();
  }

  async findTableRelationsByName(tableName: string): Promise<any> {
    return await this.entityMysqlRepository.findTableRelationsByName(tableName);
  }
}
