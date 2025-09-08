import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IStoreService } from "../../../shared/domain/services/store.service";
import { AppDate } from "../../../shared/infraestructure/lib/app-date";
import { ExcelGenerator } from "../../../shared/infraestructure/services/file/generate-file.service";

export class GenerateReport {
  private readonly storeService: IStoreService;

  constructor(private readonly context: IAppContext) {
    this.storeService = this.context.services.storeService;
  }

  async execute(type: string = "all") {
    const data: any = this.storeService.get("REPORT");

    if (!data) return data;

    const resultData: Record<string, unknown> = {
      all: [...data.full, ...data.left_only, ...data.right_only],
      full_join: data.full,
      only_left: data.left_only,
      only_right: data.right_only,
    };
    const result = resultData[type];
    const fileName = `report-${new AppDate().toMYSQLDatetime()}.xlsx`;
    const file = new ExcelGenerator(fileName, result);
    await file.create();

    return { return_type: "file", file };
  }
}
