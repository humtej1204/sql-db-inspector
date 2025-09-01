import { IPagination, ISorting } from "./db-response.interface";

export interface IFind<T> {
  pagination?: IPagination;
  sorts?: Array<ISorting>;
  criteria?: Partial<T>;
}
