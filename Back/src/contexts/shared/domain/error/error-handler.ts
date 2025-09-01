import { AppError } from "../../domain/error/app-error";
import { internalServerError } from "../../domain/error/handler-error";

export function errorHandler(error: unknown, description?: string) {
  if (error instanceof AppError) {
    return error;
  } else {
    const err = error as Error;
    return internalServerError(
      description ? `${description}: ${err.message}` : err.message
    );
  }
}
