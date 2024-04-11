import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ContainerComponent } from './components/container/container.component';
import { AmountByDepartmentComponent } from './components/containers/amount-by-department/amount-by-department.component';
import { AmountTotalComponent } from './components/containers/amount-total/amount-total.component';
import { LastCreatedComponent } from './components/containers/last-created/last-created.component';
import { TotalByStatusComponent } from './components/containers/total-by-status/total-by-status.component';
import { TotalByTypeComponent } from './components/containers/total-by-type/total-by-type.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import {
  SelectComponent,
  LabelComponent,
  FormGroupComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'expensesreport-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  imports: [
    CommonModule,
    ContainerComponent,
    ButtonComponent,
    AmountByDepartmentComponent,
    AmountTotalComponent,
    LastCreatedComponent,
    TotalByStatusComponent,
    TotalByTypeComponent,
    OverlayPanelModule,
    SelectComponent,
    LabelComponent,
    FormGroupComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DashboardPageComponent implements OnInit {
  dateOptions = dateOptions;
  dateFormGroup = new FormGroup({
    date: new FormControl(dateOptions[0].value, []),
  });
  selectedDate = dateOptions[0];

  @ViewChild(OverlayPanel)
  dateOverlay!: OverlayPanel;

  ngOnInit() {
    console.log('init');
  }

  onDateClick(event: Event) {
    this.dateOverlay.toggle(event);
  }

  onFilterClick() {
    console.log('filter');
    console.log(this.dateFormGroup.value);

    this.dateOverlay.hide();
    this.selectedDate =
      dateOptions.find(
        (option) => option.value === this.dateFormGroup.value.date
      ) || dateOptions[0];
  }

  onReloadClick() {
    console.log('reload');
  }
}

const dateOptions = [
  {
    label: 'last 7 days',
    value: 'last7days',
  },
  {
    label: 'last 30 days',
    value: 'last30days',
  },
  {
    label: 'last 90 days',
    value: 'last90days',
  },
  {
    label: 'last year',
    value: 'lastYear',
  },
];
