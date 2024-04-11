import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportsCreatePageComponent } from './expense-reports-create-page.component';

describe('ExpenseReportsCreatePageComponent', () => {
  let component: ExpenseReportsCreatePageComponent;
  let fixture: ComponentFixture<ExpenseReportsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportsCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
