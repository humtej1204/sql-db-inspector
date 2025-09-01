import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import {
  IDBDataItemsRequired,
  IDBDataItemRequired,
} from "../../../shared/domain/interfaces/db-response.interface";
import { IPaginationQuery } from "../../../shared/domain/interfaces/pagination-query.interface";
import { IFind } from "../../../shared/domain/interfaces/find.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZEDTO } from "../../domain/interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZE } from "../../domain/interfaces/ENTITYKEBAB.interface";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";

export class FindENTITYCAPITALIZE {
  private readonly ENTITYRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async findByFilters(
    filters?: IFind<IENTITYCAPITALIZE>,
    pagination?: IPaginationQuery
  ): Promise<IDBDataItemsRequired<IENTITYCAPITALIZEDTO>> {
    try {
      return await this.ENTITYRepository.find(filters, pagination);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findById(
    ENTITYId: string
  ): Promise<IDBDataItemRequired<IENTITYCAPITALIZEDTO>> {
    try {
      return await this.ENTITYRepository.findByUuid(ENTITYId);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
