import { Router } from "express";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";
import { EntityMysqlController } from "../controllers/entity-mysql.controller";
import { RouterBase } from "../routes-config/routes-base";

class EntityMysqlRouter extends RouterBase<EntityMysqlController> {
  constructor(readonly context: IAppContext) {
    super(EntityMysqlController, context);
  }

  routes(): void {
    this.router
      .route("/")
      .get(this.controller.getSchemas.bind(this.controller));
    this.router
      .route("/find-tables-relations")
      .get(this.controller.findTablesRelationsBySchemas.bind(this.controller));
    this.router
      .route("/find-value-anywhere")
      .get(this.controller.findValueAnywhere.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new EntityMysqlRouter(context).router;
