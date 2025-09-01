import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IGetBaseTablesResponse } from '../../services/app-backend-service/interfaces/response.interface';
import { AppBackendService } from '../../services/app-backend-service/app-backend-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseTableInfo } from './components/base-table-info/base-table-info';

@Component({
  selector: 'app-list-base-tables',
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
    BaseTableInfo,
  ],
  templateUrl: './list-base-tables.html',
  styleUrl: './list-base-tables.scss',
})
export class ListBaseTables implements OnInit {
  protected columnsToDisplay: string[] = ['name', 'schema', 'rows'];
  protected columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  protected data: IGetBaseTablesResponse[] = [];
  protected source = new MatTableDataSource<IGetBaseTablesResponse>();
  protected expandedElement!: IGetBaseTablesResponse | null;
  protected showEmptyTables = false;

  constructor(private readonly appBackendServ: AppBackendService) {}

  getcolumnHeader(column: string) {
    const columnsData: Record<string, string> = {
      name: 'Nombre Completo',
      schema: 'Schema',
      rows: 'N° de Datos',
    };

    return columnsData[column] ?? '';
  }

  ngOnInit(): void {
    this.appBackendServ.getBaseTables().subscribe((data) => {
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

  isExpanded(element: IGetBaseTablesResponse) {
    return this.expandedElement === element;
  }

  toggle(element: IGetBaseTablesResponse) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
}
