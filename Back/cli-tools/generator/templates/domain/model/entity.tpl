import { IENTITYCAPITALIZEBase } from "../interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZE } from "../interfaces/ENTITYKEBAB.interface";
import { IENTITYCAPITALIZEDTO } from "../interfaces/dto/ENTITYKEBAB-dto.interface";
import { ENTITYCAPITALIZEId } from "../value-objects/ENTITYKEBAB-id";

export class ENTITYCAPITALIZE {
  private constructor(
    public readonly ENTITYId?: ENTITYCAPITALIZEId
  ) {}

  static create(data: IENTITYCAPITALIZEBase): ENTITYCAPITALIZE {
    return new ENTITYCAPITALIZE();
  }

  static fromPrimitives(data: IENTITYCAPITALIZE): ENTITYCAPITALIZE {
    return new ENTITYCAPITALIZE(
      new ENTITYCAPITALIZEId(data.ENTITYId)
    );
  }

  toPrimitives(): IENTITYCAPITALIZE {
    const data: IENTITYCAPITALIZE = {
      ENTITYId: this.ENTITYId?.value ?? "",
    };

    return data;
  }

  toDatabase(): IENTITYCAPITALIZEBase {
    return {};
  }

  toDTO(data: IENTITYCAPITALIZEDTO): IENTITYCAPITALIZEDTO {
    return {
      ENTITYId: String(this.ENTITYId?.value),
      insDatetime: data.insDatetime,
      updDatetime: data.updDatetime,
      delDatetime: data.delDatetime,
    };
  }
}
