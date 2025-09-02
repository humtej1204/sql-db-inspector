import { IEntityMysqlRepository } from "../../../../../entity-mysql/domain/entity-mysql-repository";
import { EntityMysqlRepository } from "../../../../../entity-mysql/infrastructure/repository/entity-mysql.repository";
import { IEntitySqlServerRepository } from "../../../../../entity-sql-server/domain/entity-sql-server-repository";
import { EntitySqlServerRepository } from "../../../../../entity-sql-server/infrastructure/repository/entity-sql-server.repository";
import { IAppRepositories } from "../../../../domain/app-context/app-repositories/app-repositories.interface";
import { mysqlDB } from "../../../database/mysql";
import { sqlServerDB } from "../../../database/sql-server";

export class AppRepositories implements IAppRepositories {
  entityMysqlRepository: IEntityMysqlRepository;
  entitySqlServerRepository: IEntitySqlServerRepository;

  constructor() {
    this.entityMysqlRepository = new EntityMysqlRepository(mysqlDB.db!);
    this.entitySqlServerRepository = new EntitySqlServerRepository(sqlServerDB);
  }
}
