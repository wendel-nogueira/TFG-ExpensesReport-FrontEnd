import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(
    header: string,
    message: string,
    accept: () => void,
    reject: () => void
  ) {
    this.confirmationService.confirm({
      header,
      message,
      accept: accept,
      reject: reject,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      acceptIcon: 'pi pi-fw pi-check',
      acceptButtonStyleClass: 'p-button-success button-dialog',
      rejectIcon: 'pi pi-fw pi-times',
      rejectButtonStyleClass: 'p-button-danger button-dialog',
    });
  }
}
