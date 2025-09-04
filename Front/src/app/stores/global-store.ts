import { Injectable } from '@angular/core';
import { SqlServerEntityService } from '../services/app-backend-service/sql-server-entity/sql-server-entity-service';
import { BehaviorSubject } from 'rxjs';
import {
  IGetAllTablesResponse,
  IListDatabasesResponse,
} from '../services/app-backend-service/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalStore {
  private readonly tableList$ = new BehaviorSubject<IGetAllTablesResponse[]>([]);
  private readonly sqlDatabaseList$ = new BehaviorSubject<IListDatabasesResponse[]>([]);
  private readonly tableList = this.tableList$.asObservable();
  private readonly databaseList = this.sqlDatabaseList$.asObservable();

  constructor(private readonly appBackendServ: SqlServerEntityService) {}

  setNewSQLDatabasesList() {
    this.appBackendServ.listDatabases().subscribe((response) => {
      this.sqlDatabaseList$.next(response.data);
    });
  }

  setNewTableList() {
    this.appBackendServ.getAllTables().subscribe((response) => {
      this.tableList$.next(response.data);
    });
  }

  getTableList() {
    return this.tableList;
  }

  getSQLDatabaseList() {
    return this.databaseList;
  }
}
