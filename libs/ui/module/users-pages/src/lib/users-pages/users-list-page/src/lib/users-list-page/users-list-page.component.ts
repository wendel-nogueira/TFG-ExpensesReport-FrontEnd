import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-users-list-page',
  standalone: true,
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.css',
  imports: [
    CommonModule,
    TableComponent,
    OverlayPanelModule,
    ViewComponent,
    RouterModule,
  ],
})
export class UsersListPageComponent {
  columns: TableColumn[] = [];
  users: any[] = [];
  loading = false;

  dataClicked: any | null = null;

  onclickMore(event: { event: PointerEvent; data: any }, op: OverlayPanel) {
    this.dataClicked = event.data;

    op.toggle(event.event);
  }
}
