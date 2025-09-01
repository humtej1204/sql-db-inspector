import { Component, Input } from '@angular/core';
import { IGetTablesRelationsResponse } from '../../../../services/app-backend-service/interfaces/response.interface';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-table-info',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './table-info.html',
  styleUrl: './table-info.scss',
})
export class TableInfo {
  @Input() data!: IGetTablesRelationsResponse;

  protected displayedColumns: string[] = ['column', 'type'];
}
