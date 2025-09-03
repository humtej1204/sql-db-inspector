import { Injectable } from '@angular/core';
import { SqlServerEntityService } from '../services/app-backend-service/sql-server-entity/sql-server-entity-service';
import { BehaviorSubject } from 'rxjs';
import { IGetAllTablesResponse } from '../services/app-backend-service/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalStore {
  private tableList$ = new BehaviorSubject<IGetAllTablesResponse[]>([]);
  private readonly tableList = this.tableList$.asObservable();

  constructor(private readonly appBackendServ: SqlServerEntityService) {}

  setNewTableList() {
    this.appBackendServ.getAllTables().subscribe((response) => {
      this.tableList$.next(response.data);
    });
  }

  getNewTableList() {
    return this.tableList;
  }
}
