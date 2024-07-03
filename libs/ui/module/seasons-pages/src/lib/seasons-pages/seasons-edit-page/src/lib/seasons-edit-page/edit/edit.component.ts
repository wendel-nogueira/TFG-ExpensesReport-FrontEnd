import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Season } from '@expensesreport/models';
import {
  DialogService,
  SeasonService,
  ToastService,
} from '@expensesreport/services';
import {
  ButtonComponent,
  FormGroupComponent,
  InputTextComponent,
  LabelComponent,
  PageContentComponent,
  TextAreaComponent,
} from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditComponent implements OnChanges {
  @Input() id: string | null = null;
  @Input() season: Season | null = null;
  @Input() loading = false;
  @Input() disabled = false;

  seasonFormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]),
  });
  nameErrors = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters',
    maxlength: 'Name must be at most 50 characters',
  };
  codeErrors = {
    required: 'Code is required',
    minlength: 'Code must be at least 2 characters',
    maxlength: 'Code must be at most 10 characters',
    exists: 'Code already exists',
  };

  constructor(
    private router: Router,
    private seasonService: SeasonService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnChanges(changes: { id: SimpleChange; season: SimpleChange }) {
    if (changes.id)
      this.id = changes.id.currentValue ? changes.id.currentValue : null;

    if (changes.season) {
      this.season = changes.season.currentValue
        ? changes.season.currentValue
        : null;

      if (this.season) {
        this.seasonFormGroup.patchValue({
          name: this.season.name,
          code: this.season.code,
        });
      }
    }
  }

  onCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;

    if (this.seasonFormGroup.controls.code.invalid) {
      this.seasonFormGroup.controls.code.markAllAsTouched();
      this.seasonFormGroup.controls.code.updateValueAndValidity();

      return;
    }

    if (code && code !== '') {
      this.seasonService.checkIfCodeExists(code).subscribe(
        (response) => {
          if (response) {
            this.seasonFormGroup.controls.code.setErrors({
              exists: true,
            });
          }
        },
        () => {
          this.toastService.showError('Error checking code');
        }
      );
    }
  }

  onBack() {
    this.router.navigate(['/seasons']);
  }

  onSubmit() {
    if (!this.season) {
      this.toastService.showError('Season not found');
      this.router.navigate(['/seasons']);
      return;
    }

    if (this.seasonFormGroup.invalid) {
      this.seasonFormGroup.markAllAsTouched();
      this.seasonFormGroup.controls.name.updateValueAndValidity();

      return;
    }

    this.loading = true;

    const seasonToUpdate: Season = {
      ...this.season,
      name: this.seasonFormGroup.controls.name.value as string,
      code: this.seasonFormGroup.controls.code.value as string,
    };

    this.seasonService.update(seasonToUpdate).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Season updated');
        this.router.navigate(['/seasons']);
      },
      () => {
        this.toastService.showError('Error updating season');
        this.loading = false;
      }
    );
  }

  onDelete() {
    if (!this.season) {
      this.toastService.showError('Season not found');
      this.router.navigate(['/seasons']);
      return;
    }

    if (this.season.projects && this.season.projects.length > 0) {
      this.toastService.showError(
        'Season has projects, you need to disassociate them before deleting the season'
      );
      return;
    }

    this.dialogService.confirm(
      'Delete season',
      'Are you sure you want to delete this season?',
      () => this.deleteSeason(),
      () => undefined
    );
  }

  deleteSeason() {
    if (!this.season) return;

    this.loading = true;

    this.seasonService.delete(this.season.id as string).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Season deleted');
        this.router.navigate(['/seasons']);
      },
      () => {
        this.toastService.showError('Error deleting season');
        this.loading = false;
      }
    );
  }
}
