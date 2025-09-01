import { IEntityMysqlRepository } from "../../../../entity-mysql/domain/entity-mysql-repository";
import { IEntitySqlServerRepository } from "../../../../entity-sql-server/domain/entity-sql-server-repository";

export interface IAppRepositories {
  entityMysqlRepository: IEntityMysqlRepository;
  entitySqlServerRepository: IEntitySqlServerRepository;
}
