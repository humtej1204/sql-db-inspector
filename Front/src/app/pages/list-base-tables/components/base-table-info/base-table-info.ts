import { Component, Input } from '@angular/core';
import { IGetBaseTablesResponse } from '../../../../services/app-backend-service/interfaces/response.interface';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-base-table-info',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './base-table-info.html',
  styleUrl: './base-table-info.scss',
})
export class BaseTableInfo {
  @Input() data!: IGetBaseTablesResponse;

  protected displayedColumns: string[] = ['column', 'type'];
}
