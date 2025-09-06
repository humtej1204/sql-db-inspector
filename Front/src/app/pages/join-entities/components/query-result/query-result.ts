import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DinamicTable } from '../dinamic-table/dinamic-table';

@Component({
  selector: 'app-query-result',
  imports: [CommonModule, MatTabsModule, DinamicTable],
  templateUrl: './query-result.html',
  styleUrl: './query-result.scss',
})
export class QueryResult {
  @Input() data: any;
}
