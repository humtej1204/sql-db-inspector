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
      .get(this.controller.getBaseTables.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new EntityMysqlRouter(context).router;
