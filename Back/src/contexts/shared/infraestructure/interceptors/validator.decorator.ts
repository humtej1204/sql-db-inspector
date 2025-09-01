import { Request } from "express";
import {
  badRequestError,
  unauthorizedError,
} from "../../domain/error/handler-error";
import { translate } from "../../domain/services/lang.service";

export function validator(langText: string, schemaV: any) {
  return function (
    _: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw unauthorizedError(
        translate("other.decorators.events.error.validator")
      );
    }

    descriptor.value = async function (...args: any[]) {
      const { body } = args[0] as Request;
      let langErrorMessageValidation = JSON.parse(
        translate("entity.common.error.validator")
      );

      const { errorMessage, required } = JSON.parse(
        translate(`${langText}.${propertyKey}`)
      );

      langErrorMessageValidation = {
        ...langErrorMessageValidation,
        fields: { errorMessage },
        required: { ...required },
      };

      const schema = schemaV(langErrorMessageValidation);
      if (!schema(body))
        return badRequestError(
          JSON.stringify({
            errors: (schema as any).errors,
            message: translate(`other.methods.error.${propertyKey}`),
          })
        );

      const response = await originalMethod.apply(this, args);

      return response;
    };

    return descriptor;
  };
}
