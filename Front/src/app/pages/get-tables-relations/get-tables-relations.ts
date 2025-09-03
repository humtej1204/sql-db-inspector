import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private readonly appBackendServ: SqlServerEntityService) {}

  getcolumnHeader(column: string) {
    const columnsData: Record<string, string> = {
      name: 'Nombre Completo',
      schema: 'Schema',
      rows: 'N° de Datos',
    };

    return columnsData[column] ?? '';
  }

  ngOnInit(): void {
    this.appBackendServ.getTablesRelations().subscribe((data) => {
      this.data = data.data;
      this.handleShowEmptyTables();
    });
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
}
