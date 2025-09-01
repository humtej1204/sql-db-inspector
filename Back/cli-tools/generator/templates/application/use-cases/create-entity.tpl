import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { insertedId } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZEBase } from "../../domain/interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";
import { ENTITYCAPITALIZE } from "../../domain/model/ENTITYKEBAB";

export class CreateENTITYCAPITALIZE {
  private readonly ENTITYRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async execute(
    data: IENTITYCAPITALIZEBase
  ): Promise<IDBDataItemRequired<insertedId>> {
    try {
      const product = ENTITYCAPITALIZE.create(data);

      return await this.ENTITYRepository.create(product.toPrimitives());
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
