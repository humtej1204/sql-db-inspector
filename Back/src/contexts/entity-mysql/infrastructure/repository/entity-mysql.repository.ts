import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IMySQLDB } from "../../../shared/infraestructure/database/mysql";
import { IEntityMysqlRepository } from "../../domain/entity-mysql-repository";

export class EntityMysqlRepository implements IEntityMysqlRepository {
  constructor(private readonly db: IMySQLDB) {}

  async findBaseTables(): Promise<any> {
    try {
      const [results] = await this.db.query(``);

      return results;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findTablesRelations(): Promise<any> {
    try {
      const [results] = await this.db.query(``);

      return results;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findTableRelationsByName(tableName: string): Promise<any> {
    try {
      const [results] = await this.db.query(`${tableName}`);

      return results;
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
