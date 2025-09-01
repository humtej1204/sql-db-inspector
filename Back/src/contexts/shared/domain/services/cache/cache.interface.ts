export interface ISaveCacheBase {
  key: string;
  value: string;
  ttl?: number;
}

export interface IUpdateCacheBase extends Omit<ISaveCacheBase, "ttl"> {}
