import express, { Application, NextFunction, Request, Response } from "express";
import { IAppContext } from "../contexts/shared/domain/app-context/app-context.interface";
import { routes } from "./routes-config";
import {
  HttpCode,
  statusResponse,
} from "../contexts/shared/infraestructure/lib/http-status-codes";
import { STAGE } from "../contexts/shared/infraestructure/config/enum/enums";

class API {
  api: Application;

  constructor(readonly context: IAppContext) {
    this.api = express();
    this.api.use(routes(this.context));

    this.api.use("/health", (_req: Request, res: Response) => {
      res.status(200).json({
        kindMessage: "I'm alive",
        success: false,
      });
    });

    this.api.use((_req: Request, res: Response) => {
      res.status(HttpCode.NOT_FOUND).json({
        kindMessage: statusResponse.NOT_FOUND,
        success: false,
      });
    });

    this.api.use(
      (err: any, _req: Request, _res: Response, next: NextFunction) => {
        let aux;
        if (aux == STAGE.PROD) delete err.stack;
        next(err);
      }
    );
  }
}

export const api = (context: IAppContext): Application => new API(context).api;
