export interface IStoreService {
  get(key: string): unknown;
  save(key: string, data: unknown): void;
}
