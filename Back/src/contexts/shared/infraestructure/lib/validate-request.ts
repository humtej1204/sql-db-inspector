import { badRequestError } from "../../domain/error/handler-error";
import { translate } from "../../domain/services/lang.service";

export const validate = <T>({
  langErrorMessages,
  schemaValidation,
  body,
  entityMessages,
}: {
  langErrorMessages: string;
  schemaValidation: (langValue: any) => any;
  body: T;
  entityMessages: {
    langUbication: string;
    values: Record<string, any>;
  };
}) => {
  const langValue = JSON.parse(translate(langErrorMessages));
  const schema = schemaValidation(langValue);
  if (!schema(body))
    throw badRequestError(
      JSON.stringify({
        errors: (schema as any).errors,
        message: translate(entityMessages.langUbication, entityMessages.values),
      })
    );

  return true;
};
