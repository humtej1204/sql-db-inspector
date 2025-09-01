/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from "../../domain/error/error-handler";
import { IEnvironments } from "../interfaces/environments.interface";
import { appConsole } from "./app-console";

export function checkEnvVariables(env: IEnvironments) {
  const verifyEnvironment = (
    variables: { [key: string]: string | undefined } | string | undefined,
    key: string
  ): void => {
    if (variables === undefined || variables === "undefined")
      throw errorHandler(`Variable ${key} is undefined`);
    if (typeof variables === "object") {
      appConsole.log(`||========== ENV ${key.toUpperCase()} ==========||`);
      Object.entries(variables).forEach(([key, value]) => {
        verifyEnvironment(value, key);
      });
      return;
    }
    if (["pass", "secret", "apiKey"].includes(key)) {
      appConsole.log(`ENV ${key.toUpperCase()} => ${variables.slice(0, 3)}...`);
      return;
    }
    appConsole.log(`ENV ${key.toUpperCase()} => ${variables}`);
  };
  verifyEnvironment(env as any, "ENV");
}
