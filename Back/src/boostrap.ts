import { mysqlDB } from "./contexts/shared/infraestructure/database/mysql";
import { sqlServerDB } from "./contexts/shared/infraestructure/database/sql-server";
import { appConsole } from "./contexts/shared/infraestructure/utils/app-console";
import { server } from "./server";

export async function bootstrap() {
  try {
    await mysqlDB.connect();
    await sqlServerDB.connect();

    return server();
  } catch (err) {
    appConsole.error("Error during bootstrap:", err);
    process.exit(1);
  }
}
