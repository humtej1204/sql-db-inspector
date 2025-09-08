import { IStoreService } from "../../../domain/services/store.service";

export class StoreService implements IStoreService {
  data: Map<string, unknown> = new Map<string, unknown>();

  get(key: string): unknown {
    return this.data.get(key);
  }

  save(key: string, data: unknown): void {
    this.data.set(key, data);
  }
}
