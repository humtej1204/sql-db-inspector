import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICommonBackendResponse } from '../../interfaces/common-backend-response.interface';
import {
  IGetTableRelationsByNameParams,
  IFindValueAnywhereParams,
} from '../interfaces/params.interface';
import {
  IGetAllTablesResponse,
  IGetBaseTablesResponse,
  IGetTablesRelationsResponse,
  IGetTableRelationsByNameResponse,
  IFindValueAnywhereResponse,
  IListDatabasesResponse,
} from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class SqlServerEntityService {
  private readonly uriBase = environment.backendService;
  private readonly basePath = 'v1/entity-sql-server';

  private readonly http = inject(HttpClient);

  listDatabases() {
    const uri = `${this.uriBase}/${this.basePath}/find-database-list`;

    return this.http.get<ICommonBackendResponse<IListDatabasesResponse[]>>(uri);
  }

  getAllTables(database?: string) {
    const uri = `${this.uriBase}/${this.basePath}/find-tables`;
    const params = database ? { database } : undefined;

    return this.http.get<ICommonBackendResponse<IGetAllTablesResponse[]>>(uri, {
      params,
    });
  }

  getBaseTables(database?: string) {
    const uri = `${this.uriBase}/${this.basePath}/find-base-tables`;
    const params = database ? { database } : undefined;

    return this.http.get<ICommonBackendResponse<IGetBaseTablesResponse[]>>(uri, {
      params,
    });
  }

  getTablesRelations(database?: string) {
    const uri = `${this.uriBase}/${this.basePath}/find-tables-relations`;
    const params = database ? { database } : undefined;

    return this.http.get<ICommonBackendResponse<IGetTablesRelationsResponse[]>>(uri, {
      params,
    });
  }

  getTableRelationsByName(data: IGetTableRelationsByNameParams) {
    const uri = `${this.uriBase}/${this.basePath}/find-tables-relations/by-name`;

    return this.http.get<ICommonBackendResponse<IGetTableRelationsByNameResponse>>(uri, {
      params: new HttpParams({ fromObject: data ?? {} }),
    });
  }

  findValueAnywhere(data: IFindValueAnywhereParams) {
    const uri = `${this.uriBase}/${this.basePath}/find-value-anywhere`;

    return this.http.get<ICommonBackendResponse<IFindValueAnywhereResponse[]>>(uri, {
      params: new HttpParams({ fromObject: data ?? {} }),
    });
  }
}
