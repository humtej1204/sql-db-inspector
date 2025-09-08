import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IJoinDataFromTablesParams } from "../domain/interfaces/join-data-from-tables-params.interface";
import { FindEntityJoined } from "./use-cases/find-entity-joined";
import { GenerateReport } from "./use-cases/generate-report";

export class EntityJoinedUseCases {
  private readonly findEntityJoinedUseCase: FindEntityJoined;
  private readonly generateReportUseCase: GenerateReport;

  constructor(readonly appContext: IAppContext) {
    this.findEntityJoinedUseCase = new FindEntityJoined(appContext);
    this.generateReportUseCase = new GenerateReport(appContext);
  }

  joinDataFromTables(data: IJoinDataFromTablesParams) {
    return this.findEntityJoinedUseCase.joinDataFromTables(data);
  }

  generateReport(type?: string) {
    return this.generateReportUseCase.execute(type);
  }
}
