import { AppError } from "../../domain/error/app-error";
import { internalServerError } from "../../domain/error/handler-error";
import { sqlServerDB } from "../../infraestructure/database/sql-server";

interface IErrorHandlerOptions {
  description?: string;
  callback?: () => any;
}

function isSQLDBTokenAuthError(error: any): boolean {
  const msg = `${error?.message || ""} ${
    error?.originalError?.message || ""
  }`.toLowerCase();
  const code = (error?.code || error?.originalError?.code || "").toString();
  return (
    code === "ELOGIN" ||
    /login failed/i.test(msg) ||
    /token.*expir/i.test(msg) ||
    /ExpiredAuthenticationToken/i.test(msg)
  );
}

export async function errorHandler(
  error: unknown,
  options?: IErrorHandlerOptions
) {
  if (error instanceof AppError) {
    return error;
  } else if (options?.callback && isSQLDBTokenAuthError(error)) {
    await sqlServerDB.refreshTokenAndReconnect();
    return await options.callback();
  } else {
    const err = error as Error;
    return internalServerError(
      options?.description
        ? `${options.description}: ${err.message}`
        : err.message
    );
  }
}
