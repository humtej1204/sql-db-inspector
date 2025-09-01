import { Component, OnInit, signal } from '@angular/core';
import { AppBackendService } from '../../services/app-backend-service/app-backend-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IFindValueAnywhereParams } from '../../services/app-backend-service/interfaces/params.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
  protected source: Array<{ name: string; schema: string; table: string; columns: string[] }> = [];
  protected loading = signal(false);
  protected form!: FormGroup;

  constructor(
    private readonly appBackendServ: AppBackendService,
    private readonly matSnackBar: MatSnackBar,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', Validators.required],
      schema: [''],
      searchMode: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.findValue) return;
    this.loading.set(true);
    const { value, schema, searchMode } = this.form.getRawValue();

    const payload: IFindValueAnywhereParams = {
      value: value!.trim(),
    };
    if (schema) payload.schema = schema?.trim();
    if (searchMode) payload.searchMode = searchMode;

    this.findValue(payload);
  }

  findValue(data: IFindValueAnywhereParams) {
    this.appBackendServ.findValueAnywhere(data).subscribe((response) => {
      const data = response.data;

      this.source = data;
      this.loading.set(false);
    });
  }

  onCopied(success: boolean) {
    this.matSnackBar.open(success ? '¡Copiado al portapapeles!' : 'No se pudo copiar', 'OK', {
      duration: 3000,
      panelClass: success ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
