import { EntityMysqlUseCases } from "../../contexts/entity-mysql/application/entity-mysql.use-cases";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import { Controller } from "../../contexts/shared/infraestructure/interceptors/controller.decorator";

@Controller
export class EntityMysqlController {
  private readonly entityMysqlUseCases: EntityMysqlUseCases;

  constructor(readonly context: IAppContext) {
    this.entityMysqlUseCases = new EntityMysqlUseCases(context);
  }

  async getBaseTables() {
    try {
      const response = await this.entityMysqlUseCases.findBaseTables();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTablesRelations() {
    try {
      const response = await this.entityMysqlUseCases.findTablesRelations();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTableRelationsByName(tableName: string) {
    try {
      const response = await this.entityMysqlUseCases.findTableRelationsByName(
        tableName
      );

      return response;
    } catch (error) {
      return error;
    }
  }
}
