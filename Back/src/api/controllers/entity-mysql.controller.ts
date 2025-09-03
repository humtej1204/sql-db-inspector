import { EntityMysqlUseCases } from "../../contexts/entity-mysql/application/entity-mysql.use-cases";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import {
  Controller,
  IControllerData,
} from "../../contexts/shared/infraestructure/interceptors/controller.decorator";

@Controller
export class EntityMysqlController {
  private readonly entityMysqlUseCases: EntityMysqlUseCases;

  constructor(readonly context: IAppContext) {
    this.entityMysqlUseCases = new EntityMysqlUseCases(context);
  }

  async getSchemas() {
    try {
      const response = await this.entityMysqlUseCases.findSchemas();

      return response;
    } catch (error) {
      return error;
    }
  }

  async findTablesRelationsBySchemas() {
    try {
      const response =
        await this.entityMysqlUseCases.findTablesRelationsBySchemas();

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

      const response = await this.entityMysqlUseCases.findValueAnywhere(
        value,
        options
      );

      return response;
    } catch (error) {
      return error;
    }
  }
}
