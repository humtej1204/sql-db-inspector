import { Router } from "express";
import { RouterBase } from "../routes-config/routes-base";
import { ENTITYCAPITALIZEController } from "../controllers/ENTITYKEBAB.controller";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";

class ENTITYCAPITALIZERouter extends RouterBase<ENTITYCAPITALIZEController> {
  constructor(readonly context: IAppContext) {
    super(ENTITYCAPITALIZEController, context);
  }

  routes(): void {
    this.router
      .route("/")
      .get(this.controller.listENTITIESCAPITALIZE.bind(this.controller));
    this.router
      .route("/:ENTITYId")
      .get(this.controller.findENTITYCAPITALIZEById.bind(this.controller));

    this.router
      .route("/")
      .post(this.controller.createENTITYCAPITALIZE.bind(this.controller));

    this.router
      .route("/:ENTITYId")
      .patch(this.controller.updateENTITYCAPITALIZE.bind(this.controller));

    this.router
      .route("/:ENTITYId")
      .delete(this.controller.deleteENTITYCAPITALIZE.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new ENTITYCAPITALIZERouter(context).router;
