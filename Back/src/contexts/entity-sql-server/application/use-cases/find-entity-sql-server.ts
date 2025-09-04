import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { sqlServerDB } from "../../../shared/infraestructure/database/sql-server";
import { IEntitySqlServerRepository } from "../../domain/entity-sql-server-repository";
import { IFindTableRelationsByNameParams } from "../../domain/interfaces/find-table-relations-by-name-params.interface";
import { IFindValueAnywhereOptionsParams } from "../../domain/interfaces/find-values-anywhere-params.interface";

export class FindEntitySqlServer {
  private readonly entitySqlServerRepository: IEntitySqlServerRepository;

  constructor(private readonly context: IAppContext) {
    this.entitySqlServerRepository =
      this.context.repositories.entitySqlServerRepository;
  }

  async connectDb(database: string): Promise<any> {
    await sqlServerDB.connect(database);
    const connection = await sqlServerDB.getConnection(database);

    return { connected: connection.connected };
  }

  getDatabaseList() {
    return [
      { key: "EDI-HUB", name: "EDI-HUB" },
      { key: "INTEGRATION-GATEWAY", name: "INTEGRATION-GATEWAY" },
      { key: "Internal", name: "Internal" },
      { key: "system-AccessAbilities", name: "system-AccessAbilities" },
      { key: "system-Alongside", name: "system-Alongside" },
      {
        key: "system-AscendBehaviorPartners",
        name: "system-AscendBehaviorPartners",
      },
      {
        key: "system-AtoZPediatricTherapy",
        name: "system-AtoZPediatricTherapy",
      },
      { key: "system-BehavenKids", name: "system-BehavenKids" },
      {
        key: "system-BehaviorOneAutismSolution",
        name: "system-BehaviorOneAutismSolution",
      },
      { key: "system-EnlightAutism", name: "system-EnlightAutism" },
      { key: "system-GreatStrides", name: "system-GreatStrides" },
      { key: "system-KidsSPOT", name: "system-KidsSPOT" },
      { key: "system-Lamplight", name: "system-Lamplight" },
      { key: "system-LearnBehavioral", name: "system-LearnBehavioral" },
      { key: "system-LittleLeaves", name: "system-LittleLeaves" },
      { key: "system-MySpot", name: "system-MySpot" },
      { key: "system-ProvenBehavior", name: "system-ProvenBehavior" },
      { key: "system-VerbalBeginnings", name: "system-VerbalBeginnings" },
      { key: "WEB-ROOT", name: "WEB-ROOT" },
    ];
  }

  async findAllTables(database?: string): Promise<any> {
    return await this.entitySqlServerRepository.findAllTables(database);
  }

  async findBaseTables(database?: string): Promise<any> {
    return await this.entitySqlServerRepository.findBaseTables(database);
  }

  async findTablesRelations(database?: string): Promise<any> {
    return await this.entitySqlServerRepository.findTablesRelations(database);
  }

  async findTableRelationsByName(
    params: IFindTableRelationsByNameParams
  ): Promise<any> {
    return await this.entitySqlServerRepository.findTableRelationsByName(
      params
    );
  }

  async findValueAnywhere(
    value: string,
    opts: IFindValueAnywhereOptionsParams
  ): Promise<any> {
    return await this.entitySqlServerRepository.findValueAnywhere(value, opts);
  }
}
