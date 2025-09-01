/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { STAGE } from "../config/enum/enums";
import { env } from "../config/environments";
import { unauthorizedError } from "../../domain/error/handler-error";
import { translate } from "../../domain/services/lang.service";

export function SetCookieSessionToken(
  _: any,
  __: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
) {
  const originalMethod = descriptor.value;

  if (!originalMethod) {
    throw unauthorizedError(translate("other.decorators.events.error.login"));
  }

  descriptor.value = async function (...args: any[]) {
    const req = args[0] as Request;
    const res = args[1] as Response;

    const response = await originalMethod.call(this, req, res);

    res.cookie("sessionToken", response.data.item.sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(env.stage === STAGE.PROD && { secure: true }),
    });
    delete response.data?.item?.sessionToken;

    return response;
  };
}
