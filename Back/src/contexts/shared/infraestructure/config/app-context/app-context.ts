import { IAppContext } from "../../../domain/app-context/app-context.interface";
import { IAppExternalServices } from "../../../domain/app-context/app-external-services/app-external-services.interface";
import { IAppRepositories } from "../../../domain/app-context/app-repositories/app-repositories.interface";
import { IAppServices } from "../../../domain/app-context/app-services/app-services.interface";
import { initLang } from "../../services/lang/lang-boot";
import { AppExternalServices } from "./app-external-services/app-external-services";
import { AppRepositories } from "./app-repositories/app-repositories";
import { AppServices } from "./app-services/app-services";

export class AppContext implements IAppContext {
  repositories: IAppRepositories;
  externalServices: IAppExternalServices;
  services: IAppServices;

  constructor() {
    this.repositories = new AppRepositories();
    this.externalServices = new AppExternalServices();
    this.services = new AppServices();

    initLang();
  }
}
