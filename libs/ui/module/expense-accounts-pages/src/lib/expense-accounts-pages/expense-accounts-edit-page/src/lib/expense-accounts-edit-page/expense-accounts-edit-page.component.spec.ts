import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountsEditPageComponent } from './expense-accounts-edit-page.component';

describe('ExpenseAccountsEditPageComponent', () => {
  let component: ExpenseAccountsEditPageComponent;
  let fixture: ComponentFixture<ExpenseAccountsEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountsEditPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountsEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
