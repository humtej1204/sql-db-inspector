import { Router } from "express";
import path from "path";

import fs from "fs";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";

const PATH_ROUTER = path.join(__dirname, "../", "routes");

const router = Router();

export const routes = (context: IAppContext): Router => {
  console.log(PATH_ROUTER);
  fs.readdirSync(PATH_ROUTER).filter(async (file) => {
    const cleanFileName = file.split(".")[0];
    const cleanFileNameOne = file.split(".")[1];

    if (cleanFileNameOne === "routes") {
      if (cleanFileName !== "router" && cleanFileName !== "common") {
        const moduleRouter = await import(
          path.join(PATH_ROUTER, `${String(cleanFileName)}.routes`)
        );

        if (moduleRouter.router) {
          router.use(`/${cleanFileName}`, moduleRouter.router(context));
        }
      }
    }
  });
  return router;
};
