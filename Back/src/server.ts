/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { IAppContext } from "./contexts/shared/domain/app-context/app-context.interface";
import {
  HttpCode,
  statusResponse,
} from "./contexts/shared/infraestructure/lib/http-status-codes";
import { api } from "./api/api";
import { AppContext } from "./contexts/shared/infraestructure/config/app-context/app-context";

class Server {
  private readonly api: Application;
  app: Application;

  constructor(private readonly context: IAppContext) {
    this.api = api(this.context);
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cors({ origin: "*" }));
    this.app.use(morgan("dev"));

    this.app.use("/v1", this.api);

    this.app.use((_req: Request, res: Response) => {
      res.status(HttpCode.NOT_FOUND).json({
        success: false,
        kindMessage: statusResponse.NOT_FOUND,
      });
    });

    this.app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        Object.defineProperty(err, "message", {
          enumerable: true,
        });

        res.json(err);
      }
    );
  }
}

export const server = () => new Server(new AppContext()).app;
