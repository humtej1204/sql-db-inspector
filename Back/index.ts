import fs from "fs";
import { env } from "./src/contexts/shared/infraestructure/config/environments";
import { checkEnvVariables } from "./src/contexts/shared/infraestructure/utils/check-env-variables.util";
import { AppError } from "./src/contexts/shared/domain/error/app-error";
import { appConsole } from "./src/contexts/shared/infraestructure/utils/app-console";
import { bootstrap } from "./src/boostrap";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const apiVersion = packageJson.version;

process.on("uncaughtException", (error: Error) => {
  appConsole.error("uncaughtException", error);
  const isTrusted = error instanceof AppError;
  if (!isTrusted) {
    process.exit(1);
  }
});

checkEnvVariables(env);

bootstrap().then((server) =>
  server.listen(env.app.port, () => {
    appConsole.log(
      `Server running on port ${env.app.port} version: ${apiVersion}`
    );
  })
);
