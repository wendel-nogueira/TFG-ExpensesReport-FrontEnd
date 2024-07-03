import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
  TextAreaComponent,
  SelectItem,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  DepartmentService,
  ProjectService,
  SeasonService,
  ToastService,
} from '@expensesreport/services';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { Department } from '@expensesreport/models';
import { DepartmentStatus, UserRoles } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-projects-create-page',
  standalone: true,
  templateUrl: './projects-create-page.component.html',
  styleUrl: './projects-create-page.component.css',
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
    MultiSelectModule,
  ],
})
export class ProjectsCreatePageComponent implements OnInit {
  loading = false;
  disabled = false;

  @ViewChild('msSeasons') msSeasons: MultiSelect | undefined;
  @ViewChild('msDepartments') msDepartments: MultiSelect | undefined;

  selectedItemsSeasons!: SelectItem[];
  selectedItemsDepartments!: SelectItem[];
  selectAllSeasons = false;
  selectAllDepartments = false;

  itemsSeasons: SelectItem[] = [];
  itemsDepartments: SelectItem[] = [];

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
    seasons: new FormControl('', [Validators.required]),
    departments: new FormControl('', [Validators.required]),
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
  seasonsErrors = {
    required: 'Seasons are required',
  };
  departmentsErrors = {
    required: 'Departments are required',
  };
  descriptionErrors = {
    maxlength: 'Description must be at most 2000 characters',
  };

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private seasonService: SeasonService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.seasonService.getAll().subscribe(
      (seasons) => {
        this.itemsSeasons = seasons.map((season) => {
          return {
            label: season.name,
            value: season.id || '',
          };
        });

        this.loading = false;
      },
      () => {
        this.toastService.showError('Error loading seasons');
      }
    );

    this.getDepartments();
    // this.departmentService.getAll().subscribe(
    //   (departments) => {
    //     this.itemsDepartments = departments.map((department) => {
    //       return {
    //         label: department.name,
    //         value: department.id || '',
    //       };
    //     });

    //     this.loading = false;
    //   },
    //   () => {
    //     this.toastService.showError('Error loading departments');
    //   }
    // );
  }

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
          if (response) {
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
          if (!(controlName === 'code')) control.updateValueAndValidity();
        }
      });

      return;
    }

    this.loading = true;
    this.selectedItemsSeasons = [];
    this.selectedItemsDepartments = [];
    this.selectAllSeasons = false;
    this.selectAllDepartments = false;

    const seasons = this.projectFormGroup.controls.seasons
      .value as unknown as SelectItem[];
    const departments = this.projectFormGroup.controls.departments
      .value as unknown as SelectItem[];

    const project: {
      name: string;
      code: string;
      description: string;
      seasonsIds: string[];
      departmentsIds: string[];
    } = {
      name: this.projectFormGroup.controls.name.value || '',
      code: this.projectFormGroup.controls.code.value || '',
      description: this.projectFormGroup.controls.description.value || '',
      seasonsIds: seasons.map((season) => season.value) || [],
      departmentsIds: departments.map((department) => department.value) || [],
    };

    this.projectService.create(project).subscribe(
      () => {
        this.loading = false;

        this.toastService.showSuccess('Project created');
        this.router.navigate(['/projects']);
      },
      () => {
        this.toastService.showError('Error creating project');
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/projects']);
  }

  onSelectAllSeasonsChange(event: { checked: boolean }) {
    this.selectAllSeasons = event.checked;

    if (this.msSeasons)
      this.selectedItemsSeasons = event.checked
        ? [...this.msSeasons.visibleOptions()]
        : [];
  }

  onSelectAllDepartmentsChange(event: { checked: boolean }) {
    this.selectAllDepartments = event.checked;

    if (this.msDepartments)
      this.selectedItemsDepartments = event.checked
        ? [...this.msDepartments.visibleOptions()]
        : [];
  }

  getDepartments() {
    this.loading = true;

    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const isRoot =
      userInfo.identity?.role === UserRoles.Accountant ||
      userInfo.identity?.role === UserRoles.Admin;

    this.departmentService.getAll().subscribe(
      (departments) => {
        const allDepartments: Department[] = [];

        for (let i = 0; i < departments.length; i++) {
          if (
            !departments[i].id ||
            (!isRoot &&
              (departments[i].status === DepartmentStatus.Deleted ||
                departments[i].status === DepartmentStatus.Inactive))
          ) {
            continue;
          }

          this.departmentService.get(departments[i].id!).subscribe(
            (department) => {
              allDepartments.push(department);

              if (departments.length === allDepartments.length) {
                this.itemsDepartments = [];

                const tempDepartments: SelectItem[] = [];

                for (let j = 0; j < allDepartments.length; j++) {
                  if (
                    userInfo.identity?.role === UserRoles.Accountant ||
                    userInfo.identity?.role === UserRoles.Admin
                  ) {
                    tempDepartments.push({
                      label: allDepartments[j].name,
                      value: allDepartments[j].id || '',
                    });
                  } else if (
                    (allDepartments[j].managers?.find(
                      (m) => m === userInfo.id
                    ) ||
                      allDepartments[j].employees?.find(
                        (e) => e === userInfo.id
                      )) &&
                    allDepartments[j].status !== DepartmentStatus.Deleted &&
                    allDepartments[j].status !== DepartmentStatus.Inactive
                  ) {
                    tempDepartments.push({
                      label: allDepartments[j].name,
                      value: allDepartments[j].id || '',
                    });
                  }
                }

                console.log(tempDepartments);
                this.itemsDepartments = tempDepartments;
                this.loading = false;
              }
            },
            (error) => {
              throw new Error('Error getting department');
            }
          );
        }
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }
}
