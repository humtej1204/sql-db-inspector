import { EntityJoinedUseCases } from "../../contexts/entity-joined/application/entity-joined.use-cases";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import {
  Controller,
  IControllerData,
} from "../../contexts/shared/infraestructure/interceptors/controller.decorator";

@Controller
export class EntityJoinedController {
  private readonly entityJoinedUseCases: EntityJoinedUseCases;

  constructor(readonly context: IAppContext) {
    this.entityJoinedUseCases = new EntityJoinedUseCases(context);
  }

  async joinDataFromTables({ body }: IControllerData) {
    try {
      const response = await this.entityJoinedUseCases.joinDataFromTables(
        body as any
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async generateReport({ body }: IControllerData) {
    try {
      const type = String((body as any)?.type ?? "");
      const response = await this.entityJoinedUseCases.generateReport(type);

      return response;
    } catch (error) {
      return error;
    }
  }
}
