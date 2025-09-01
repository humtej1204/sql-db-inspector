export interface IValidatorMessage {
  type?: string;
  required?: Record<string, string>;
  properties?: Record<string, string>;
  additionalProperties?: string;
  fields?: any;
}
