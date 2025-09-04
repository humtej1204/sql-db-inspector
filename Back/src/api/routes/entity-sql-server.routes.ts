import { Router } from "express";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import { RouterBase } from "../routes-config/routes-base";
import { EntitySqlServerController } from "../controllers/entity-sql-server.controller";

class EntitySqlServerRouter extends RouterBase<EntitySqlServerController> {
  constructor(readonly context: IAppContext) {
    super(EntitySqlServerController, context);
  }

  routes(): void {
    this.router
      .route("/connect")
      .post(this.controller.connectDb.bind(this.controller));
    this.router
      .route("/find-database-list")
      .get(this.controller.findDatabaseList.bind(this.controller));
    this.router
      .route("/find-tables")
      .get(this.controller.getAllTables.bind(this.controller));
    this.router
      .route("/find-base-tables")
      .get(this.controller.getBaseTables.bind(this.controller));
    this.router
      .route("/find-tables-relations")
      .get(this.controller.getTablesRelations.bind(this.controller));
    this.router
      .route("/find-tables-relations/by-name")
      .get(this.controller.getTableRelationsByName.bind(this.controller));
    this.router
      .route("/find-value-anywhere")
      .get(this.controller.findValueAnywhere.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new EntitySqlServerRouter(context).router;
