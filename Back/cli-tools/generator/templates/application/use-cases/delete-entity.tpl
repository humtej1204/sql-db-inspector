import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { modifiedCount } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";

export class DeleteENTITYCAPITALIZE {
  private readonly ENTITYRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async execute(
    ENTITYId: string
  ): Promise<IDBDataItemRequired<modifiedCount>> {
    try {
      return await this.ENTITYRepository.deleteByUuid(ENTITYId);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
