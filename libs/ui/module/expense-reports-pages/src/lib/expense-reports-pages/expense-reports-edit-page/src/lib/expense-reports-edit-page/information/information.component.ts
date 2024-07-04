import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  DepartmentStatus,
  ExpenseReportStatus,
  expenseReportStatusToName,
  roleToName,
  UserRoles,
} from '@expensesreport/enums';
import { Department, ExpenseReport, User } from '@expensesreport/models';
import {
  AuthService,
  DepartmentService,
  DialogService,
  ExpenseReportService,
  PdfService,
  ProjectService,
  ToastService,
} from '@expensesreport/services';
import {
  ButtonComponent,
  FormGroupComponent,
  LabelComponent,
  SelectComponent,
  SelectItem,
  TextAreaComponent,
  UploadComponent,
} from '@expensesreport/ui';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'expensesreport-information',
  standalone: true,
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  imports: [
    CommonModule,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    TextAreaComponent,
    UploadComponent,
  ],
})
export class InformationComponent implements OnInit, OnChanges {
  @Input() expenseReport: ExpenseReport | null = null;

  user: string | null = null;
  isAccountant = false;
  isSupervisor = false;

  loading = false;
  disabled = true;
  status = '';

  departments: SelectItem[] = [];
  projects: SelectItem[] = [];

  expenseReportFormGroup = new FormGroup({
    department: new FormControl('', [Validators.required]),
    project: new FormControl('', [Validators.required]),
  });

  buttons = {
    update: false,
    approve: false,
    reject: false,
    pay: false,
    rejectPayment: false,
    cancel: false,
  };

  showModal = false;
  type: 'pay' | 'reject' | null = null;
  rejectionNotes = new FormControl('', [
    Validators.required,
    Validators.maxLength(2000),
  ]);
  rejectionNotesErrors = {
    required: 'Rejection Notes are required',
    maxlength: 'Rejection Notes must be at most 2000 characters',
  };
  proofOfPayment = new FormControl('', [Validators.required]);
  paymentNotes = new FormControl('', [
    Validators.required,
    Validators.maxLength(2000),
  ]);
  paymentNotesErrors = {
    required: 'Payment Notes are required',
    maxlength: 'Payment Notes must be at most 2000 characters',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private projectService: ProjectService,
    private expenseReportService: ExpenseReportService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    const data = this.authService.getSessionData();

    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    this.user = data.nameid;
    this.isAccountant = data.role === roleToName(UserRoles.Accountant);
    this.isSupervisor = false;

    if (
      this.expenseReport?.status === ExpenseReportStatus.SubmittedForApproval &&
      this.expenseReport?.userId === this.user
    ) {
      this.disabled = false;
    }

    this.loading = true;

    this.getDepartments();

    // this.loading = true;

    // this.departmentService.getAll().subscribe((departments) => {
    //   this.departments = departments.map((department) => ({
    //     label: department.name,
    //     value: department.id as string,
    //   }));
    //   this.loading = false;
    // });
  }

  ngOnChanges() {
    const data = this.authService.getSessionData();

    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    this.user = data.nameid;
    this.isAccountant = data.role === roleToName(UserRoles.Accountant);
    this.expenseReportFormGroup.reset();

    this.loading = true;
    this.status = expenseReportStatusToName(this.expenseReport?.status || 0);
    this.isSupervisor = this.expenseReport?.user?.supervisors?.some(
      (supervisor) => supervisor.identityId === this.user
    ) as boolean;

    if (
      this.expenseReport?.status === ExpenseReportStatus.SubmittedForApproval
    ) {
      this.buttons.approve = this.isSupervisor;
      this.buttons.reject = this.isSupervisor;
    } else if (
      this.expenseReport?.status === ExpenseReportStatus.ApprovedBySupervisor &&
      this.isAccountant
    ) {
      this.buttons.pay = this.isAccountant;
      this.buttons.rejectPayment = this.isAccountant;
    }

    this.buttons.update =
      this.expenseReport?.user?.identityId === this.user &&
      (this.expenseReport?.status === ExpenseReportStatus.Created ||
        this.expenseReport?.status ===
          ExpenseReportStatus.SubmittedForApproval);

    this.buttons.cancel =
      this.expenseReport?.status !== ExpenseReportStatus.Cancelled &&
      this.expenseReport?.userId === this.user;

    if (this.expenseReport?.departmentId) {
      this.expenseReportFormGroup.patchValue({
        department: this.expenseReport.departmentId,
      });

      this.projectService
        .getByDepartment(this.expenseReport.departmentId)
        .subscribe((projects) => {
          this.projects = projects.map((project) => ({
            label: `#${project.code}: ${project.name}`,
            value: project.id as string,
          }));
          this.loading = false;
        });
    }

    if (this.expenseReport?.projectId) {
      this.expenseReportFormGroup.patchValue({
        project: this.expenseReport.projectId,
      });
    }
  }

  onDepartmentChange(event: { value: string }) {
    this.projects = [];
    this.expenseReportFormGroup.get('project')?.reset();

    if (!event || !event.value) {
      return;
    }

    this.loading = true;

    this.projectService.getByDepartment(event.value).subscribe((projects) => {
      this.projects = projects.map((project) => ({
        label: `#${project.code}: ${project.name}`,
        value: project.id as string,
      }));
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.expenseReportFormGroup.invalid) {
      Object.keys(this.expenseReportFormGroup.controls).forEach(
        (controlName) => {
          const control = this.expenseReportFormGroup.get(controlName);

          if (control) {
            control.markAsTouched();
            control.updateValueAndValidity();
          }
        }
      );

      return;
    }

    if (!this.expenseReport?.id) {
      return;
    }

    const expenseReportUpdate: ExpenseReport = {
      id: this.expenseReport?.id,
      departmentId: this.expenseReportFormGroup.get('department')
        ?.value as string,
      projectId: this.expenseReportFormGroup.get('project')?.value as string,
    };

    this.dialogService.confirm(
      'Update Expense Report',
      'Are you sure you want to update this expense report?',
      () => {
        this.updateExpenseReport(expenseReportUpdate);
      },
      () => undefined
    );
  }

  updateExpenseReport(expenseReport: ExpenseReport) {
    this.loading = true;

    this.expenseReportService.update(expenseReport).subscribe(
      () => {
        this.toastService.showSuccess('Expense report updated successfully');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  changeStatus(status: number) {
    if (!this.expenseReport?.id) {
      return;
    }

    const statusName =
      status === 2
        ? 'Approve'
        : status === 3
        ? 'Reject'
        : status === 4
        ? 'Pay'
        : status === 5
        ? 'Pay partially'
        : status === 6
        ? 'Reject payment'
        : 'Cancel';

    this.dialogService.confirm(
      `${statusName} Expense Report`,
      `Are you sure you want to ${statusName.toLowerCase()} this expense report?`,
      () => {
        this.updateStatus(status as ExpenseReportStatus);
      },
      () => undefined
    );
  }

  updateStatus(status: ExpenseReportStatus) {
    if (!this.expenseReport?.id) {
      return;
    }

    this.loading = true;

    this.expenseReportService
      .updateStatus(this.expenseReport.id, {
        status,
      })
      .subscribe(
        () => {
          this.toastService.showSuccess('Status updated successfully');
          this.loading = false;

          this.router.navigate(['/expense-reports']);
        },
        (error) => {
          this.toastService.showError(error);
          this.loading = false;
        }
      );
  }

  approve() {
    if (!this.expenseReport?.id) {
      return;
    }

    const id = this.expenseReport.id;

    this.loading = true;

    this.dialogService.confirm(
      'Approve Expense Report',
      'Are you sure you want to approve this expense report?',
      () => {
        this.expenseReportService
          .updateApproval(id, {
            isApproved: true,
            notes: 'Approved',
          })
          .subscribe(
            () => {
              this.toastService.showSuccess(
                'Expense report approved successfully'
              );
              this.loading = false;

              this.router.navigate(['/expense-reports']);
            },
            (error) => {
              this.toastService.showError(error);
              this.loading = false;
            }
          );
      },
      () => undefined
    );
  }

  reject() {
    if (!this.expenseReport?.id) {
      return;
    }

    const id = this.expenseReport.id;

    this.loading = true;

    this.dialogService.confirm(
      'Reject Expense Report',
      'Are you sure you want to reject this expense report?',
      () => {
        this.expenseReportService
          .updateApproval(id, {
            isApproved: false,
            notes: 'Rejected',
          })
          .subscribe(
            () => {
              this.toastService.showSuccess(
                'Expense report rejected successfully'
              );
              this.loading = false;

              this.router.navigate(['/expense-reports']);
            },
            (error) => {
              this.toastService.showError(error);
              this.loading = false;
            }
          );
      },
      () => undefined
    );
  }

  onPay() {
    if (!this.expenseReport?.id) {
      return;
    }

    if (!this.proofOfPayment.valid || !this.paymentNotes.valid) {
      this.proofOfPayment.markAllAsTouched();
      this.proofOfPayment.updateValueAndValidity();
      this.paymentNotes.markAllAsTouched();
      this.paymentNotes.updateValueAndValidity();
      return;
    }

    const notes = this.paymentNotes.value;
    const proofOfPayment = this.proofOfPayment.value;

    this.loading = true;

    const payment = {
      paidById: this.user,
      paidDate: new Date().toISOString(),
      paidDateTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      paymentNotes: notes,
      proofOfPayment,
    };

    this.expenseReportService.pay(this.expenseReport.id, payment).subscribe(
      () => {
        this.toastService.showSuccess('Expense report paid successfully');
        this.loading = false;

        this.router.navigate(['/expense-reports']);
      },
      (error: any) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onReject() {
    if (!this.expenseReport?.id) {
      return;
    }

    if (!this.rejectionNotes.valid) {
      this.rejectionNotes.markAllAsTouched();
      this.rejectionNotes.updateValueAndValidity();
      return;
    }

    const notes = this.rejectionNotes.value || '';

    this.loading = true;

    this.expenseReportService
      .rejectPayment(this.expenseReport.id, notes)
      .subscribe(
        () => {
          this.toastService.showSuccess(
            'Expense report payment rejected successfully'
          );
          this.loading = false;

          this.router.navigate(['/expense-reports']);
        },
        (error: any) => {
          this.toastService.showError(error);
          this.loading = false;
        }
      );
  }

  onBack() {
    this.router.navigate(['/expense-reports']);
  }

  onExport() {
    if (!this.expenseReport?.id) {
      return;
    }

    this.loading = true;

    this.pdfService
      .generateExpenseReportPDF(this.expenseReport)
      .then(() => {
        this.loading = false;

        this.toastService.showSuccess('PDF generated successfully');
      })
      .catch((error) => {
        this.toastService.showError(error);
        this.loading = false;
      });
  }

  getDepartments() {
    const user = localStorage.getItem('user') || '{}';
    const userInfo = (JSON.parse(user) as User) || {};

    this.departmentService.getAll().subscribe(
      (departments) => {
        const allDepartments: Department[] = [];

        console.log(departments);

        for (let i = 0; i < departments.length; i++) {
          if (
            !departments[i].id ||
            departments[i].status === DepartmentStatus.Deleted ||
            departments[i].status === DepartmentStatus.Inactive
          ) {
            continue;
          }

          this.departmentService.get(departments[i].id!).subscribe(
            (department) => {
              allDepartments.push(department);

              if (departments.length === allDepartments.length) {
                this.departments = [];
                const tempDepartments: Department[] = [];

                for (let j = 0; j < allDepartments.length; j++) {
                  console.log(allDepartments[j]);
                  if (
                    userInfo.identity?.role === UserRoles.Accountant ||
                    userInfo.identity?.role === UserRoles.Admin
                  ) {
                    tempDepartments.push(allDepartments[j]);
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
                    tempDepartments.push(allDepartments[j]);
                  }
                }

                console.log(tempDepartments);

                this.departments = tempDepartments.map((department) => ({
                  label: department.name,
                  value: department.id as string,
                }));
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
