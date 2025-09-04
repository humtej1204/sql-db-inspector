import { IEntityMysqlRepository } from "../../../entity-mysql/domain/entity-mysql-repository";
import { IEntitySqlServerRepository } from "../../../entity-sql-server/domain/entity-sql-server-repository";
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IJoinDataFromTablesParams } from "../../domain/interfaces/join-data-from-tables-params.interface";

export class FindEntityJoined {
  private readonly entityMysqlRepository: IEntityMysqlRepository;
  private readonly entitySqlServerRepository: IEntitySqlServerRepository;

  constructor(private readonly context: IAppContext) {
    this.entityMysqlRepository =
      this.context.repositories.entityMysqlRepository;
    this.entitySqlServerRepository =
      this.context.repositories.entitySqlServerRepository;
  }

  async joinDataFromTables(data: IJoinDataFromTablesParams): Promise<any> {
    try {
      const mysqlData = await this.entityMysqlRepository.executeQuery(
        data.mysql?.query
      );
      const sqlData = await this.entitySqlServerRepository.executeQuery(
        data.sql?.query,
        data.mysql?.database
      );

      if (!mysqlData || !sqlData) return { mysqlData, sqlData };

      // Add code to join tables
      return { mysqlData, sqlData };
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
