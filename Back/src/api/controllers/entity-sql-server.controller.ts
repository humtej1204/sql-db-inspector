import { EntitySqlServerUseCases } from "../../contexts/entity-sql-server/application/entity-sql-server.use-cases";
import { IFindTableRelationsByNameParams } from "../../contexts/entity-sql-server/domain/interfaces/find-table-relations-by-name-params.interface";
import { IFindValueAnywhereOptionsParams } from "../../contexts/entity-sql-server/domain/interfaces/find-values-anywhere-params.interface";
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

  async connectDb({ body }: IControllerData) {
    try {
      const database = String((body as any).database ?? "");
      const response = await this.entitySqlServerUseCases.connectDb(database);

      return response;
    } catch (error) {
      return error;
    }
  }

  async findDatabaseList() {
    try {
      const response = this.entitySqlServerUseCases.findDatabaseList();

      return response;
    } catch (error) {
      return error;
    }
  }

  async getAllTables({ query }: IControllerData) {
    try {
      const database = String(query?.database ?? "");
      const response = await this.entitySqlServerUseCases.findAllTables(
        database
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async getBaseTables({ query }: IControllerData) {
    try {
      const database = String(query?.database ?? "");
      const response = await this.entitySqlServerUseCases.findBaseTables(
        database
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTablesRelations({ query }: IControllerData) {
    try {
      const database = String(query?.database ?? "");
      const response = await this.entitySqlServerUseCases.findTablesRelations(
        database
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async getTableRelationsByName({ query }: IControllerData) {
    try {
      const schema = String(query?.schema ?? "");
      const table = String(query?.table ?? "");
      const database = String(query?.database ?? "");

      const params: IFindTableRelationsByNameParams = {
        table: table,
      };
      if (query?.schema) params.schema = schema;
      if (query?.database) params.database = database;

      const response =
        await this.entitySqlServerUseCases.findTableRelationsByName(params);

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
      const database = String(query?.database ?? "") as any;

      const options: IFindValueAnywhereOptionsParams = {};
      if (query?.schema) options.schema = schema;
      if (query?.searchMode) options.searchMode = searchMode;
      if (query?.database) options.database = database;

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
