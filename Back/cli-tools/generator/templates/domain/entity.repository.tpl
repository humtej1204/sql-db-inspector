import { CommonOperations } from "../../shared/domain/interfaces/repository-base.interface";
import { IENTITYCAPITALIZEBase } from "./interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZEDTO } from "./interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZE } from "./interfaces/ENTITYKEBAB.interface";

export interface IENTITYCAPITALIZERepository
  extends CommonOperations<
    IENTITYCAPITALIZE,
    IENTITYCAPITALIZEBase,
    IENTITYCAPITALIZEDTO
  > {}
