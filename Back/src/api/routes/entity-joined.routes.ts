import { Router } from "express";
import { RouterBase } from "../routes-config/routes-base";
import { EntityJoinedController } from "../controllers/entity-joined.controller";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";

class EntityJoinedRouter extends RouterBase<EntityJoinedController> {
  constructor(readonly context: IAppContext) {
    super(EntityJoinedController, context);
  }

  routes(): void {
    this.router
      .route("/join-data")
      .post(this.controller.joinDataFromTables.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new EntityJoinedRouter(context).router;
