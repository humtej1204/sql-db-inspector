import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { GlobalStore } from '../../stores/global-store';
import { IListDatabasesResponse } from '../../services/app-backend-service/interfaces/response.interface';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { EntityJoinedService } from '../../services/app-backend-service/entity-joined/entity-joined-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-join-entities',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    TextFieldModule,
  ],
  templateUrl: './join-entities.html',
  styleUrl: './join-entities.scss',
})
export class JoinEntities implements OnInit {
  protected loading = signal(false);
  protected form!: FormGroup;
  protected databaseList: IListDatabasesResponse[] = [];
  protected defaultDB: string = 'system-Alongside';

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  constructor(
    private readonly entityJoinedService: EntityJoinedService,
    private readonly globalStore: GlobalStore,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.listSQLDatabases();
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

  listSQLDatabases() {
    this.globalStore.getSQLDatabaseList().subscribe((res) => {
      this.databaseList = res;
      if (this.databaseList.length)
        this.form.patchValue({
          sql: { database: this.defaultDB },
        });
    });
  }

  onSubmit() {
    this.loading.set(true);
    const payload = this.form.getRawValue();
    this.entityJoinedService
      .joinDataFromTables(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
