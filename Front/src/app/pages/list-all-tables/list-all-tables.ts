import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalStore } from '../../stores/global-store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IGetAllTablesResponse } from '../../services/app-backend-service/interfaces/response.interface';

@Component({
  selector: 'app-list-all-tables',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSortModule,
  ],
  templateUrl: './list-all-tables.html',
  styleUrl: './list-all-tables.scss',
})
export class ListAllTables implements OnInit {
  protected displayedColumns: string[] = ['name', 'schema', 'rows'];
  protected allTables: IGetAllTablesResponse[] = [];
  protected source = new MatTableDataSource<IGetAllTablesResponse>();
  protected showEmptyTables = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly globalStore: GlobalStore,
    private readonly liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.globalStore.getTableList().subscribe((data) => {
      this.allTables = data;
      this.handleShowEmptyTables();
    });
  }

  ngAfterViewInit() {
    this.source.sort = this.sort;
  }

  handleShowEmptyTables() {
    if (!this.showEmptyTables) this.source.data = this.allTables.filter((e) => e.rows > 0);
    else this.source.data = this.allTables;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }
}
