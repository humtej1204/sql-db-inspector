import { Request, Response } from "express";
import { unauthorizedError } from "../../domain/error/handler-error";
import { translate } from "../../domain/services/lang.service";

export function ClearCookies(
  _: any,
  __: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
) {
  const originalMethod = descriptor.value;

  if (!originalMethod) {
    throw unauthorizedError(translate("other.decorators.events.error.logout"));
  }

  descriptor.value = async function (...args: any[]) {
    const req = args[0] as Request;
    const res = args[1] as Response;

    const response = await originalMethod.apply(this, args);

    Object.keys(req.cookies).forEach((cookie) => {
      res.clearCookie(cookie);
    });

    return response;
  };
}
