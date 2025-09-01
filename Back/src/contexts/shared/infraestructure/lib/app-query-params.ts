import { Request } from "express";
import { String } from "../utils/string";
import {
  IPagination,
  ISorting,
  TSort,
} from "../../domain/interfaces/db-response.interface";
export class AppQueryParams {
  static check(req: Request) {
    const queryParams = req.query;
    if (queryParams.page) this.applyPagination(req);
    if (queryParams.sort) this.applySorts(req);
    if (queryParams.search) this.applySearching(req);
  }

  static applyPagination(req: Request) {
    const queryParams = req.query;
    const pagination: IPagination = {
      page: Number(queryParams.page),
      size: Number(queryParams.size ?? 10),
    };

    req.pagination = pagination;
  }

  static applySorts(req: Request) {
    const queryParamsSort = req.query.sort;
    const sorts: Array<ISorting> = [];

    if (Array.isArray(queryParamsSort)) {
      for (const sort of queryParamsSort) {
        const sorting = this.buildSorting(sort as string);
        if (sorting) sorts.push(sorting);
      }
    }

    if (String.isString(queryParamsSort)) {
      const sort = queryParamsSort as string;
      const sorting = this.buildSorting(sort);
      if (sorting) sorts.push(sorting);
    }

    if (sorts.length) req.sorts = sorts;
  }

  static applySearching(req: Request) {
    const queryParamsSearch = req.query.search as string;
    const decodeSearch = decodeURIComponent(queryParamsSearch);

    req.search = decodeSearch;
  }

  static buildSorting(sort: string): ISorting | null {
    const values = sort.split("-");
    if (values.length === 2) {
      const sorting: ISorting = {
        by: values[0],
        sort: values[1] as TSort,
      };
      return sorting;
    } else {
      return null;
    }
  }
}
