import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportsPagesComponent } from './expense-reports-pages.component';

describe('ExpenseReportsPagesComponent', () => {
  let component: ExpenseReportsPagesComponent;
  let fixture: ComponentFixture<ExpenseReportsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportsPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
