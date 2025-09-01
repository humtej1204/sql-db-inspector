import { Injectable } from '@angular/core';
import { AppBackendService } from '../services/app-backend-service/app-backend-service';
import { BehaviorSubject } from 'rxjs';
import { IGetAllTablesResponse } from '../services/app-backend-service/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalStore {
  private tableList$ = new BehaviorSubject<IGetAllTablesResponse[]>([]);
  private readonly tableList = this.tableList$.asObservable();

  constructor(private readonly appBackendServ: AppBackendService) {}

  setNewTableList() {
    this.appBackendServ.getAllTables().subscribe((response) => {
      this.tableList$.next(response.data);
    });
  }

  getNewTableList() {
    return this.tableList;
  }
}
