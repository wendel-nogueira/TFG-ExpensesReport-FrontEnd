import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportsListPageComponent } from './expense-reports-list-page.component';

describe('ExpenseReportsListPageComponent', () => {
  let component: ExpenseReportsListPageComponent;
  let fixture: ComponentFixture<ExpenseReportsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
