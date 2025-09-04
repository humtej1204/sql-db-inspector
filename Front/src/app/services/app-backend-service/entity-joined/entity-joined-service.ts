import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICommonBackendResponse } from '../../interfaces/common-backend-response.interface';
import { IJoinDataFromTablesParams } from './interfaces/params.interface';

@Injectable({
  providedIn: 'root',
})
export class EntityJoinedService {
  private readonly uriBase = environment.backendService;
  private readonly basePath = 'v1/entity-joined';

  private readonly http = inject(HttpClient);

  joinDataFromTables(payload: IJoinDataFromTablesParams) {
    const uri = `${this.uriBase}/${this.basePath}/join-data`;
    return this.http.post<ICommonBackendResponse<any>>(uri, payload);
  }
}
