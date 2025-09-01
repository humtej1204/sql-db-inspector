import { EntitySqlServerUseCases } from "../../contexts/entity-sql-server/application/entity-sql-server.use-cases";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import {
  Controller,
  IControllerData,
} from "../../contexts/shared/infraestructure/interceptors/controller.decorator";

@Controller
export class EntitySqlServerController {
  private readonly entitySqlServerUseCases: EntitySqlServerUseCases;

  constructor(readonly context: IAppContext) {
    this.entitySqlServerUseCases = new EntitySqlServerUseCases(context);
  }

  async getAllTables() {
    try {
      const response = await this.entitySqlServerUseCases.findAllTables();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getBaseTables() {
    try {
      const response = await this.entitySqlServerUseCases.findBaseTables();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTablesRelations() {
    try {
      const response = await this.entitySqlServerUseCases.findTablesRelations();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTableRelationsByName({ query }: IControllerData) {
    try {
      const schema = String(query?.schema ?? "");
      const table = String(query?.table ?? "");
      const response =
        await this.entitySqlServerUseCases.findTableRelationsByName(
          table,
          schema
        );

      return response;
    } catch (error) {
      return error;
    }
  }

  async findValueAnywhere({ query }: IControllerData) {
    try {
      const value = String(query?.value ?? "");
      const schema = String(query?.schema ?? "");
      const searchMode = String(query?.searchMode ?? "") as any;

      const options: { schema?: string; searchMode?: "contains" | "equals" } =
        {};
      if (query?.schema) options.schema = schema;
      if (query?.searchMode) options.searchMode = searchMode;

      const response = await this.entitySqlServerUseCases.findValueAnywhere(
        value,
        options
      );

      return response;
    } catch (error) {
      return error;
    }
  }
}
