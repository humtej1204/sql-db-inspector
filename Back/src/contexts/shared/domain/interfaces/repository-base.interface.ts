import {
  IDBDataItemRequired,
  IDBDataItemsRequired,
} from "./db-response.interface";
import { IFind } from "./find.interface";
import { IPaginationQuery } from "./pagination-query.interface";

export type insertedId = { insertedId: string };

export type modifiedCount = { modifiedCount: number };

export abstract class CommonOperations<Entity, CreateEntity, EntityDTO> {
  abstract create(data: CreateEntity): Promise<IDBDataItemRequired<insertedId>>;
  abstract find(
    filters?: IFind<Entity>,
    pagination?: IPaginationQuery
  ): Promise<IDBDataItemsRequired<EntityDTO>>;
  abstract findOneById(id: number): Promise<IDBDataItemRequired<EntityDTO>>;
  abstract findByUuid(uuid: string): Promise<IDBDataItemRequired<EntityDTO>>;
  abstract update(
    uuid: string,
    data: Partial<Entity>
  ): Promise<IDBDataItemRequired<modifiedCount>>;
  abstract deleteByUuid(
    uuid: string
  ): Promise<IDBDataItemRequired<modifiedCount>>;
}
