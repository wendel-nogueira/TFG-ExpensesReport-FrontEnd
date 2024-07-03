import {
  Component,
  Input,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { TableColumn, TableComponent } from '../table/table.component';
import { DialogService, ToastService } from '../../../../core/services';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { ViewComponent } from '../icons';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'expensesreport-table-page',
  standalone: true,
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css',
  imports: [
    CommonModule,
    TableComponent,
    OverlayPanelModule,
    ViewComponent,
    FormsModule,
    DialogModule,
    MultiSelectModule,
    ButtonComponent,
  ],
})
export class TablePageComponent implements OnInit {
  @Input() addTitle: string = '';
  @Input() addDescription: string = '';
  @Input() addPlaceholder: string = '';
  @Input() addButtonLabel: string = '';
  @Input() viewIconLink: string = '';
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() totalRecords: number = 0;
  @Input() items: SelectItem[] = [];
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showAddButton: boolean = true;
  @Input() showRemoveButton: boolean = true;

  @Output() add = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  @ViewChild('ms') ms: MultiSelect | undefined;

  dataClicked: Data | null = null;
  showAdd = false;

  selectedItems!: SelectItem[];
  selectAll = false;
  openSelect = false;

  loadingAdd = false;
  disabledAdd = false;

  constructor(
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    console.log(this.items);
  }

  onClickMore(event: { event: PointerEvent; data: any }, op: OverlayPanel) {
    this.dataClicked = event.data;
    op.toggle(event.event);
  }

  onSelectAllChange(event: { checked: boolean }) {
    this.selectAll = event.checked;

    if (this.ms)
      this.selectedItems = event.checked ? [...this.ms.visibleOptions()] : [];
  }

  onAdd() {
    if (this.selectedItems.length === 0) {
      this.toastService.showError('Please select at least one item');
      return;
    }

    this.loadingAdd = true;
    this.disabledAdd = true;

    this.dialogService.confirm(
      'Add',
      'Are you sure you want to add the selected items?',
      () => {
        this.add.emit(this.selectedItems);
        this.selectedItems = [];
        this.selectAll = false;
        this.openSelect = false;
        this.loadingAdd = false;
        this.disabledAdd = false;
        this.showAdd = false;
      },
      () => undefined
    );
  }

  onRemove(dataToRemove: any[]) {
    if (dataToRemove.length === 0) {
      this.toastService.showError('Please select at least one item');
      return;
    }

    this.dialogService.confirm(
      'Remove',
      'Are you sure you want to remove the selected items?',
      () => {
        this.remove.emit(dataToRemove);
      },
      () => undefined
    );
  }
}

export interface Data {
  id: string;
}

export interface SelectItem {
  label: string;
  value: string;
}
