/* eslint-disable @typescript-eslint/no-explicit-any */
import "express";
import {
  IFiltering,
  IPagination,
  ISorting,
} from "../../contexts/shared/domain/interfaces/db-response.interface";

declare global {
  namespace Express {
    interface Request {
      files?: any;
      pagination: IPagination;
      sorts: Array<ISorting>;
      search: string;
      filters?: Array<IFiltering>;
    }
  }
}
