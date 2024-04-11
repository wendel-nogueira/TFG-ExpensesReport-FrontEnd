import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseReportsEditPageComponent } from './expense-reports-edit-page.component';

describe('ExpenseReportsEditPageComponent', () => {
  let component: ExpenseReportsEditPageComponent;
  let fixture: ComponentFixture<ExpenseReportsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseReportsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseReportsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
