import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalStore } from '../../stores/global-store';
import { IListDatabasesResponse } from '../../services/app-backend-service/interfaces/response.interface';
import { EntityJoinedService } from '../../services/app-backend-service/entity-joined/entity-joined-service';
import { finalize } from 'rxjs';
import { IJoinDataFromTablesParams } from '../../services/app-backend-service/entity-joined/interfaces/params.interface';
import { QueryForm } from './components/query-form/query-form';
import { QueryResult } from './components/query-result/query-result';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-join-entities',
  imports: [CommonModule, QueryForm, QueryResult, MatIconModule, MatStepperModule, MatButtonModule],
  templateUrl: './join-entities.html',
  styleUrl: './join-entities.scss',
})
export class JoinEntities implements OnInit {
  protected loading = false;
  protected databaseList: IListDatabasesResponse[] = [];
  protected queryResult: any = [];

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('form') form!: QueryForm;

  constructor(
    private readonly entityJoinedService: EntityJoinedService,
    private readonly globalStore: GlobalStore
  ) {}

  ngOnInit(): void {
    this.listSQLDatabases();
  }

  listSQLDatabases() {
    this.globalStore.getSQLDatabaseList().subscribe((res) => {
      this.databaseList = res;
    });
  }

  onSubmit(payload: IJoinDataFromTablesParams) {
    this.loading = true;
    this.entityJoinedService
      .joinDataFromTables(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.stepper.next();
        })
      )
      .subscribe({
        next: (res) => {
          this.queryResult = res.data;
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
