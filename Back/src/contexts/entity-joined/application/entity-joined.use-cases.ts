import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IJoinDataFromTablesParams } from "../domain/interfaces/join-data-from-tables-params.interface";
import { FindEntityJoined } from "./use-cases/find-entity-joined";

export class EntityJoinedUseCases {
  private readonly findEntityJoinedUseCase: FindEntityJoined;

  constructor(readonly appContext: IAppContext) {
    this.findEntityJoinedUseCase = new FindEntityJoined(appContext);
  }

  joinDataFromTables(data: IJoinDataFromTablesParams) {
    return this.findEntityJoinedUseCase.joinDataFromTables(data);
  }
}
