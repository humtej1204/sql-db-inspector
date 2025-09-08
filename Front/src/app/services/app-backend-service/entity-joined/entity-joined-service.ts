import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICommonBackendResponse } from '../../interfaces/common-backend-response.interface';
import { IJoinDataFromTablesParams } from './interfaces/params.interface';
import { Observable } from 'rxjs';

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

  downloadReport(type: string = 'all'): Observable<HttpResponse<Blob>> {
    const uri = `${this.uriBase}/${this.basePath}/generate-report`;
    return this.http.post(
      uri,
      { type },
      {
        responseType: 'blob',
        observe: 'response',
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
}
