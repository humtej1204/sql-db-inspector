import { ENTITYCAPITALIZEUseCases } from "../../contexts/ENTITYKEBAB/application/ENTITYKEBAB.use-cases";
import { IENTITYCAPITALIZEBase } from "../../contexts/ENTITYKEBAB/domain/interfaces/ENTITYKEBAB-base.interface";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import {
  Controller,
  IControllerData,
} from "../../contexts/shared/infraestructure/interceptors/controller.decorator";

@Controller
export class ENTITYCAPITALIZEController {
  private readonly ENTITYUseCases: ENTITYCAPITALIZEUseCases;

  constructor(readonly context: IAppContext) {
    this.ENTITYUseCases = new ENTITYCAPITALIZEUseCases(context);
  }

  async listENTITIESCAPITALIZE({ pagination }: IControllerData) {
    try {
      const filters = {};

      const response = await this.ENTITYUseCases.findENTITYCAPITALIZE(
        filters,
        pagination
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async findENTITYCAPITALIZEById({ params }: IControllerData) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response =
        await this.ENTITYUseCases.findENTITYCAPITALIZEById(id);

      return response;
    } catch (error) {
      return error;
    }
  }

  async createENTITYCAPITALIZE({ body }: IControllerData<IENTITYCAPITALIZEBase>) {
    try {
      const response = await this.ENTITYUseCases.createENTITYCAPITALIZE(
        body
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async updateENTITYCAPITALIZE({
    params,
    body,
  }: IControllerData<IENTITYCAPITALIZEBase>) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response = await this.ENTITYUseCases.updateENTITYCAPITALIZE(
        id,
        body
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteENTITYCAPITALIZE({ params }: IControllerData) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response = await this.ENTITYUseCases.deleteENTITYCAPITALIZE(
        id
      );

      return response;
    } catch (error) {
      return error;
    }
  }
}
