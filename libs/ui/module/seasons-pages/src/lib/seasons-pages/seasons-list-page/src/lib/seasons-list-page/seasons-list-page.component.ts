import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { RouterModule } from '@angular/router';
import { TableColumn, TableComponent } from '@expensesreport/ui';
import { ViewComponent } from '@expensesreport/icons';
import { SeasonService, ToastService } from '@expensesreport/services';

@Component({
  selector: 'expensesreport-seasons-list-page',
  standalone: true,
  templateUrl: './seasons-list-page.component.html',
  styleUrl: './seasons-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class SeasonsListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  seasons: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  constructor(
    private seasonService: SeasonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.seasonService.getAll().subscribe(
      (seasons) => {
        console.log(seasons);

        this.seasons = seasons.map((season) => ({
          id: season.id || '',
          name: season.name,
          code: season.code,
        }));

        this.totalRecords = this.seasons.length;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  onClickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    this.dataClicked = event.data;
    op.toggle(event.event);
  }
}

const columns: TableColumn[] = [
  { field: 'code', header: 'code', sortable: true },
  { field: 'name', header: 'name', sortable: true },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  name: string;
  code: string;
}
