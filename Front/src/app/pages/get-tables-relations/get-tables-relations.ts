import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
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
import {
  IGetTablesRelationsResponse,
  IListDatabasesResponse,
} from '../../services/app-backend-service/interfaces/response.interface';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MySqlEntityService } from '../../services/app-backend-service/mysql-entity/mysql-entity-service';
import { ICommonBackendResponse } from '../../services/interfaces/common-backend-response.interface';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GlobalStore } from '../../stores/global-store';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    MatPaginatorModule,
  ],
  templateUrl: './get-tables-relations.html',
  styleUrl: './get-tables-relations.scss',
})
export class GetTablesRelations implements OnInit, AfterViewInit {
  protected columnsToDisplay: string[] = ['name', 'schema', 'rows'];
  protected columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  protected data: IGetTablesRelationsResponse[] = [];
  protected source = new MatTableDataSource<IGetTablesRelationsResponse>();
  protected expandedElement!: IGetTablesRelationsResponse | null;
  protected databaseList: IListDatabasesResponse[] = [];
  protected selectedDB: string = 'system-Alongside';
  protected selectedDBEngine: string = 'boost';
  protected showEmptyTables = false;
  protected loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly sqlServerEntityServ: SqlServerEntityService,
    private readonly mySqlEntityServ: MySqlEntityService,
    private readonly globalStore: GlobalStore
  ) {}

  ngOnInit(): void {
    this.source.filterPredicate = this.createFilterPredicate();
    this.listSQLDatabases();
    this.getData();
  }

  ngAfterViewInit() {
    this.source.paginator = this.paginator;
  }

  listSQLDatabases() {
    this.globalStore.getSQLDatabaseList().subscribe((res) => {
      this.databaseList = res;
    });
  }

  getcolumnHeader(column: string) {
    const columnsData: Record<string, string> = {
      name: 'Nombre Completo',
      schema: 'Schema',
      rows: 'N° de Datos',
    };

    return columnsData[column] ?? '';
  }

  handleShowEmptyTables() {
    if (!this.showEmptyTables) this.source.data = this.data.filter((e) => e.rows > 0);
    else this.source.data = this.data;

    this.source.paginator = this.paginator;
  }

  private normalize(v: unknown): string {
    return (v ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  private createFilterPredicate() {
    return (row: IGetTablesRelationsResponse, rawFilter: string): boolean => {
      const filter = this.normalize(rawFilter).trim();
      if (!filter) return true;

      const schema = this.normalize(row.schema);
      const table = this.normalize(row.table);
      const name = this.normalize(row.name);

      const fieldsCols = this.normalize(row.fields?.map((f) => f.column).join(' ') ?? '');

      const haystack = `${schema} ${table} ${name} ${fieldsCols}`;

      const terms = filter.split(/\s+/);
      return terms.every((t) => haystack.includes(t));
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();

    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }

  isExpanded(element: IGetTablesRelationsResponse) {
    return this.expandedElement === element;
  }

  toggle(element: IGetTablesRelationsResponse) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  onDBChange(event: MatSelectChange) {
    this.selectedDB = event.value;
    this.getData();
  }

  onDBEngineChange(event: MatSelectChange) {
    this.selectedDBEngine = event.value;
    this.getData();
  }

  getData() {
    this.loading.set(true);
    const request: Record<string, any> = {
      boost: this.sqlServerEntityServ.getTablesRelations(this.selectedDB),
      bare: this.mySqlEntityServ.getTablesRelations(),
    };

    request[this.selectedDBEngine].subscribe(
      (res: ICommonBackendResponse<IGetTablesRelationsResponse[]>) => {
        this.data = res.data;
        this.handleShowEmptyTables();

        this.loading.set(false);
      }
    );
  }
}
