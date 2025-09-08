import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { IListDatabasesResponse } from '../../../../services/app-backend-service/interfaces/response.interface';
import { IJoinDataFromTablesParams } from '../../../../services/app-backend-service/entity-joined/interfaces/params.interface';

@Component({
  selector: 'app-query-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './query-form.html',
  styleUrl: './query-form.scss',
})
export class QueryForm implements OnInit {
  @Input() databaseList: IListDatabasesResponse[] = [];
  @Input() loading: boolean = false;

  @Output() onSubmit = new EventEmitter<IJoinDataFromTablesParams>();
  protected defaultDB: string = 'system-Alongside';
  public form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      sql: this.fb.group({
        database: ['', Validators.required],
        query: ['', Validators.required],
        fk: ['', Validators.required],
      }),
      mysql: this.fb.group({
        query: ['', Validators.required],
        fk: ['', Validators.required],
      }),
    });
  }

  handleSubmit() {
    const payload = this.form.getRawValue();
    payload.sql.query = payload.sql.query.trim();
    payload.sql.fk = payload.sql.fk.trim();
    payload.mysql.query = payload.mysql.query.trim();
    payload.mysql.fk = payload.mysql.fk.trim();

    this.onSubmit.emit(payload);
  }
}
