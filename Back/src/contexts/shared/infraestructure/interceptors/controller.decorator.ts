/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { IncomingHttpHeaders } from "http2";
import { TConstructor } from "./types/decorator.type";
import { AppDate } from "../lib/app-date";
import { getDurationInMilliseconds } from "../utils/helpers";
import { AppError } from "../../domain/error/app-error";
import { ISorting } from "../../domain/interfaces/db-response.interface";
import { IPaginationQuery } from "../../domain/interfaces/pagination-query.interface";
import { STAGE } from "../config/enum/enums";
import { env } from "../config/environments";
import { AppResponse } from "../DTO/app-response";
import { AppQueryParams } from "../lib/app-query-params";
import { HttpCode } from "../lib/http-status-codes";

export interface IControllerData<T = unknown> {
  body: T;
  params?: Record<string, string | number>;
  query?: Record<string, string | number>;
  headers?: IncomingHttpHeaders & Record<string, string | number>;
  pagination?: IPaginationQuery;
  sorts?: Array<ISorting>;
  search?: string;
  cookies?: Record<string, any>;
}

export interface IPartialControllerData<T>
  extends Partial<IControllerData<T>> {}

const isValid = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export function Controller<T extends TConstructor>(constructor: T) {
  for (const fn of Object.getOwnPropertyNames(constructor.prototype)) {
    const originalMethod = constructor.prototype[fn];
    if (typeof originalMethod === "function" && fn !== "constructor") {
      constructor.prototype[fn] = async function (...args: any) {
        const req = args[0] as Request;
        const res = args[1] as Response;

        AppQueryParams.check(req);

        const start = process.hrtime();

        req.headers["ip-address"] = req.ip?.split(":").at(-1) ?? req.ip;

        const now = new AppDate().toMYSQLDatetime();
        const result = await originalMethod.call(this, req, res);
        const end = new AppDate().toMYSQLDatetime();

        const timeLapse = {
          started: now,
          ended: end,
          duration: getDurationInMilliseconds(start),
        };

        if (!result) {
          const httpCode = HttpCode.EXPECTATION_FAILED;
          const response = {
            success: false,
            kindMessage: "Error during operation",
            httpCode: httpCode,
            timeLapse,
          };

          return res.status(httpCode).json(response);
        }

        if (result.return_type) {
          const { file } = result;
          return res.download(
            `${file.path}/${file.filename}`,
            file.filename,
            (err) => {
              if (err) {
                console.error("Error enviando archivo:", err);
              }
              file.deleteTempFile();
            }
          );
        }

        if (result instanceof AppError) {
          const response = {
            success: false,
            kindMessage:
              isValid(result.message) &&
              typeof JSON.parse(result.message) === "object"
                ? JSON.parse(result.message).message
                : result.message,
            ...(isValid(result.message) &&
            typeof JSON.parse(result.message) === "object"
              ? { errors: "" }
              : {}),
            stack: result.stack,
            httpCode: result.httpCode,
            timeLapse,
          };

          if (env.stage === STAGE.PROD) delete response.stack;

          res.status(result.httpCode).json(response);
        } else {
          const { httpCode } = result;
          delete result.httpCode;

          const response = !result.data ? { data: result } : result;

          const jsonResponse = {
            ...new AppResponse(req.method, response),
            timeLapse,
          };

          res.status(httpCode ?? HttpCode.OK).json(jsonResponse);
        }
      };
    }
  }
}
