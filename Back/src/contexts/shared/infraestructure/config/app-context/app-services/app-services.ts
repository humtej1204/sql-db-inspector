import { IAppServices } from "../../../../domain/app-context/app-services/app-services.interface";
import { IStoreService } from "../../../../domain/services/store.service";
import { StoreService } from "../../../services/store/store.service";

export class AppServices implements IAppServices {
  storeService: IStoreService;

  constructor() {
    this.storeService = new StoreService();
  }
}
