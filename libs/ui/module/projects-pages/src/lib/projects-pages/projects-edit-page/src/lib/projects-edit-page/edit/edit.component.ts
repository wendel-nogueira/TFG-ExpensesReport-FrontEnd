import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
  TextAreaComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from '@expensesreport/models';
import {
  DialogService,
  ProjectService,
  ToastService,
} from '@expensesreport/services';
import { ProjectStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    SelectComponent,
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
  @Input() project: Project | null = null;
  @Input() loading = false;
  @Input() disabled = false;

  isDeleted = false;
  loadingState = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnChanges(changes: { id: SimpleChange; project: SimpleChange }) {
    if (changes.id)
      this.id = changes.id.currentValue ? changes.id.currentValue : null;

    if (changes.project) {
      this.project = changes.project.currentValue
        ? changes.project.currentValue
        : null;

      if (this.project) {
        this.projectFormGroup.patchValue({
          name: this.project.name,
          code: this.project.code,
          description: this.project.description,
        });

        this.isDeleted = this.project.status === ProjectStatus.Deleted;
      }
    }
  }

  projectFormGroup = new FormGroup({
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
    description: new FormControl('', [Validators.maxLength(2000)]),
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
  descriptionErrors = {
    maxlength: 'Description must be at most 2000 characters',
  };

  onCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;

    if (this.projectFormGroup.controls.code.invalid) {
      this.projectFormGroup.controls.code.markAllAsTouched();
      this.projectFormGroup.controls.code.updateValueAndValidity();

      return;
    }

    if (code && code !== '') {
      this.projectService.checkIfCodeExists(code).subscribe(
        (response) => {
          if (response && this.project?.code !== code) {
            this.projectFormGroup.controls.code.setErrors({
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

  onSubmit() {
    if (this.projectFormGroup.invalid) {
      Object.keys(this.projectFormGroup.controls).forEach((controlName) => {
        const control = this.projectFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      this.toastService.showError('Invalid form');
      return;
    }

    if (!this.project) {
      this.toastService.showError('Project not found');
      return;
    }

    this.dialogService.confirm(
      'Update Project',
      'Are you sure you want to update this project?',
      () => {
        this.updateProject();
      },
      () => undefined
    );
  }

  updateProject() {
    if (!this.project) return;

    const projectToUpdate: Project = {
      ...this.project,
      name: this.projectFormGroup.get('name')?.value as string,
      code: this.projectFormGroup.get('code')?.value as string,
      description: this.projectFormGroup.get('description')?.value as string,
    };

    this.loading = true;

    this.projectService.update(projectToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('Project updated');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/projects']);
  }

  onChangeStatus() {
    if (!this.project) {
      this.toastService.showError('Project not found');
      return;
    }

    const status = this.project.status;

    this.dialogService.confirm(
      `${status === ProjectStatus.Active ? 'Delete' : 'Restore'} Project`,
      `Are you sure you want to ${
        status === ProjectStatus.Active ? 'delete' : 'restore'
      } this project?`,
      () => {
        this.changeStatus(
          status === ProjectStatus.Active
            ? ProjectStatus.Deleted
            : ProjectStatus.Active
        );
      },
      () => undefined
    );
  }

  changeStatus(projectStatus: ProjectStatus) {
    if (!this.project) return;

    this.loadingState = true;

    this.projectService
      .updateStatus(this.project.id as string, projectStatus)
      .subscribe(
        (project) => {
          this.toastService.showSuccess(
            `Project ${
              projectStatus === ProjectStatus.Active ? 'restored' : 'deleted'
            }`
          );

          if (this.project) {
            this.project = {
              ...this.project,
              status: project.status,
            };

            this.isDeleted = project.status === ProjectStatus.Deleted;
          }

          this.loadingState = false;
        },
        (error) => {
          this.toastService.showError(error);
          this.loadingState = false;
        }
      );
  }
}
