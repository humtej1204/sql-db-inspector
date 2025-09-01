import { IAppExternalServices } from "./app-external-services/app-external-services.interface";
import { IAppRepositories } from "./app-repositories/app-repositories.interface";
import { IAppServices } from "./app-services/app-services.interface";

export interface IAppContext {
  repositories: IAppRepositories;
  externalServices: IAppExternalServices;
  services: IAppServices;
}
