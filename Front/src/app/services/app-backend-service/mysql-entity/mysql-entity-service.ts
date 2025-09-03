import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICommonBackendResponse } from '../../interfaces/common-backend-response.interface';
import { IFindValueAnywhereParams } from '../interfaces/params.interface';
import {
  IGetTablesRelationsResponse,
  IFindValueAnywhereResponse,
} from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class MySqlEntityService {
  private readonly uriBase = environment.backendService;
  private readonly basePath = 'v1/entity-mysql';

  private readonly http = inject(HttpClient);

  getTablesRelations() {
    const uri = `${this.uriBase}/${this.basePath}/find-tables-relations`;
    return this.http.get<ICommonBackendResponse<IGetTablesRelationsResponse[]>>(uri);
  }

  findValueAnywhere(data: IFindValueAnywhereParams) {
    const uri = `${this.uriBase}/${this.basePath}/find-value-anywhere`;
    return this.http.get<ICommonBackendResponse<IFindValueAnywhereResponse[]>>(uri, {
      params: new HttpParams({ fromObject: data ?? {} }),
    });
  }
}
