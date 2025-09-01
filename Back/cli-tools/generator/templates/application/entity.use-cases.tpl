import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IFind } from "../../shared/domain/interfaces/find.interface";
import { IPaginationQuery } from "../../shared/domain/interfaces/pagination-query.interface";
import { IENTITYCAPITALIZEBase } from "../domain/interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZE } from "../domain/interfaces/ENTITYKEBAB.interface";
import { CreateENTITYCAPITALIZE } from "./use-cases/create-ENTITYKEBAB";
import { DeleteENTITYCAPITALIZE } from "./use-cases/delete-ENTITYKEBAB";
import { FindENTITYCAPITALIZE } from "./use-cases/find-ENTITYKEBAB";
import { UpdateENTITYCAPITALIZE } from "./use-cases/update-ENTITYKEBAB";

export class ENTITYCAPITALIZEUseCases {
  private readonly findENTITYCAPITALIZEUseCase: FindENTITYCAPITALIZE;
  private readonly createENTITYCAPITALIZEUseCase: CreateENTITYCAPITALIZE;
  private readonly updateENTITYCAPITALIZEUseCase: UpdateENTITYCAPITALIZE;
  private readonly deleteENTITYCAPITALIZEUseCase: DeleteENTITYCAPITALIZE;

  constructor(readonly appContext: IAppContext) {
    this.findENTITYCAPITALIZEUseCase = new FindENTITYCAPITALIZE(appContext);
    this.createENTITYCAPITALIZEUseCase = new CreateENTITYCAPITALIZE(appContext);
    this.updateENTITYCAPITALIZEUseCase = new UpdateENTITYCAPITALIZE(appContext);
    this.deleteENTITYCAPITALIZEUseCase = new DeleteENTITYCAPITALIZE(appContext);
  }

  findENTITYCAPITALIZE(
    filters?: IFind<IENTITYCAPITALIZE>,
    pagination?: IPaginationQuery
  ) {
    return this.findENTITYCAPITALIZEUseCase.findByFilters(filters, pagination);
  }

  findENTITYCAPITALIZEById(ENTITYId: string) {
    return this.findENTITYCAPITALIZEUseCase.findById(ENTITYId);
  }

  createENTITYCAPITALIZE(data: IENTITYCAPITALIZEBase) {
    return this.createENTITYCAPITALIZEUseCase.execute(data);
  }

  updateENTITYCAPITALIZE(
    ENTITYId: string,
    data: Partial<IENTITYCAPITALIZEBase>
  ) {
    return this.updateENTITYCAPITALIZEUseCase.execute(ENTITYId, data);
  }

  deleteENTITYCAPITALIZE(ENTITYId: string) {
    return this.deleteENTITYCAPITALIZEUseCase.execute(ENTITYId);
  }
}
