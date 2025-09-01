import { CommonSchema } from "../../../shared/infraestructure/database/sql/common.schema";
import { ISchema } from "../../../shared/infraestructure/database/sql/table-builder/interfaces/schema.interface";
import { IENTITYCAPITALIZEDTO } from "../../domain/interfaces/dto/ENTITYKEBAB-dto.interface";

export const ENTITYCAPITALIZESchema: ISchema<IENTITYCAPITALIZEDTO>[] = [
  {
    columnName: "ENTITYId",
    type: "uuid",
    typeOptions: {
      length: 36,
      primaryKey: true,
    },
    typeProperties: {
      comment: "Entity MySQL Test UUID",
      unique: true,
      nullable: false,
    },
  },
  ...CommonSchema,
];
