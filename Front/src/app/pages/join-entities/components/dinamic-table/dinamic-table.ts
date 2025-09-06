import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

type Row = Record<string, any>;

@Component({
  selector: 'app-dinamic-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './dinamic-table.html',
  styleUrl: './dinamic-table.scss',
})
export class DinamicTable implements OnChanges {
  @Input() data: Row[] | null = null;

  protected dataSource = new MatTableDataSource<Row>([]);
  protected displayedColumns: string[] = [];
  protected loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.rebuildTable();
    }
  }

  private rebuildTable() {
    const rows = Array.isArray(this.data) ? this.data : [];

    const allKeys = new Set<string>();
    for (const r of rows) Object.keys(r ?? {}).forEach((k) => allKeys.add(k));

    const keys = [...allKeys];

    this.displayedColumns = keys;
    this.dataSource = new MatTableDataSource(rows);

    queueMicrotask(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  cellValue(row: Row, col: string) {
    const v = row[col];
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    if (Array.isArray(v)) return JSON.stringify(v);
    return v ?? '';
  }
}
