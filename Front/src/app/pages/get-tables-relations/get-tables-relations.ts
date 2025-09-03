import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SqlServerEntityService } from '../../services/app-backend-service/sql-server-entity/sql-server-entity-service';
import { TableInfo } from './components/table-info/table-info';
import { IGetTablesRelationsResponse } from '../../services/app-backend-service/interfaces/response.interface';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MySqlEntityService } from '../../services/app-backend-service/mysql-entity/mysql-entity-service';
import { ICommonBackendResponse } from '../../services/interfaces/common-backend-response.interface';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-get-tables-relations',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    TableInfo,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './get-tables-relations.html',
  styleUrl: './get-tables-relations.scss',
})
export class GetTablesRelations implements OnInit {
  protected columnsToDisplay: string[] = ['name', 'schema', 'rows'];
  protected columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  protected data: IGetTablesRelationsResponse[] = [];
  protected source = new MatTableDataSource<IGetTablesRelationsResponse>();
  protected expandedElement!: IGetTablesRelationsResponse | null;
  protected showEmptyTables = false;
  protected loading = signal(false);

  constructor(
    private readonly sqlServerEntityServ: SqlServerEntityService,
    private readonly mySqlEntityServ: MySqlEntityService
  ) {}

  getcolumnHeader(column: string) {
    const columnsData: Record<string, string> = {
      name: 'Nombre Completo',
      schema: 'Schema',
      rows: 'N° de Datos',
    };

    return columnsData[column] ?? '';
  }

  ngOnInit(): void {
    this.getData();
  }

  handleShowEmptyTables() {
    if (!this.showEmptyTables) this.source.data = this.data.filter((e) => e.rows > 0);
    else this.source.data = this.data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }

  isExpanded(element: IGetTablesRelationsResponse) {
    return this.expandedElement === element;
  }

  toggle(element: IGetTablesRelationsResponse) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  onDBChange(event: MatSelectChange) {
    const db = event.value;
    this.getData(db);
  }

  getData(db: string = 'boost') {
    this.loading.set(true);
    const request: Record<string, any> = {
      boost: this.sqlServerEntityServ,
      bare: this.mySqlEntityServ,
    };

    request[db]
      .getTablesRelations()
      .subscribe((data: ICommonBackendResponse<IGetTablesRelationsResponse[]>) => {
        this.data = data.data;
        this.handleShowEmptyTables();

        this.loading.set(false);
      });
  }
}
