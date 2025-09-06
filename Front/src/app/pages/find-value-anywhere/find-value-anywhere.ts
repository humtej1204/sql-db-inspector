import { Component, OnInit, signal } from '@angular/core';
import { SqlServerEntityService } from '../../services/app-backend-service/sql-server-entity/sql-server-entity-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MySqlEntityService } from '../../services/app-backend-service/mysql-entity/mysql-entity-service';
import {
  IFindValueAnywhereResponse,
  IListDatabasesResponse,
} from '../../services/app-backend-service/interfaces/response.interface';
import { IFindValueAnywhereParams } from '../../services/app-backend-service/interfaces/params.interface';
import { ICommonBackendResponse } from '../../services/interfaces/common-backend-response.interface';
import { GlobalStore } from '../../stores/global-store';

@Component({
  selector: 'app-find-value-anywhere',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    ClipboardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './find-value-anywhere.html',
  styleUrl: './find-value-anywhere.scss',
})
export class FindValueAnywhere implements OnInit {
  protected source: IFindValueAnywhereResponse[] = [];
  protected loading = signal(false);
  protected form!: FormGroup;
  protected databaseList: IListDatabasesResponse[] = [];
  protected defaultDB: string = 'system-Alongside';

  constructor(
    private readonly sqlServerEntityServ: SqlServerEntityService,
    private readonly mySqlEntityServ: MySqlEntityService,
    private readonly globalStore: GlobalStore,
    private readonly matSnackBar: MatSnackBar,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.listSQLDatabases();
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      schema: [''],
      searchMode: [''],
      database: [''],
      selectedEngine: ['boost'],
    });
  }

  listSQLDatabases() {
    this.globalStore.getSQLDatabaseList().subscribe((res) => {
      this.databaseList = res;
      if (this.databaseList.length) this.form.patchValue({ database: this.defaultDB });
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.findValue) return;
    this.loading.set(true);
    const { value, schema, searchMode, database, selectedEngine } = this.form.getRawValue();

    const payload: IFindValueAnywhereParams = {
      value: value!.trim(),
    };
    if (schema) payload.schema = schema?.trim();
    if (searchMode) payload.searchMode = searchMode;
    if (selectedEngine === 'boost') payload.database = database;

    this.findValue(payload, selectedEngine);
  }

  findValue(data: IFindValueAnywhereParams, selectedEngine: string) {
    const request: Record<string, any> = {
      boost: this.sqlServerEntityServ.findValueAnywhere(data),
      bare: this.mySqlEntityServ.findValueAnywhere(data),
    };
    request[selectedEngine].subscribe(
      (response: ICommonBackendResponse<IFindValueAnywhereResponse[]>) => {
        const data = response.data;
        this.source = data;
        this.loading.set(false);
      },
      (error: any) => {
        console.error(error);
        this.loading.set(false);
      }
    );
  }

  onCopied(success: boolean) {
    this.matSnackBar.open(success ? '¡Copiado al portapapeles!' : 'No se pudo copiar', 'OK', {
      duration: 3000,
      panelClass: success ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
