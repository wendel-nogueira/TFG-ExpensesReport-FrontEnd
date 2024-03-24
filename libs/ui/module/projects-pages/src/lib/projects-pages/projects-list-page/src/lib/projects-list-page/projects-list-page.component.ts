import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-projects-list-page',
  standalone: true,
  templateUrl: './projects-list-page.component.html',
  styleUrl: './projects-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class ProjectsListPageComponent {
  columns: TableColumn[] = [];
  projects: any[] = [];
  loading = false;

  dataClicked: any | null = null;

  onclickMore(event: { event: PointerEvent; data: any }, op: OverlayPanel) {
    this.dataClicked = event.data;

    op.toggle(event.event);
  }
}
