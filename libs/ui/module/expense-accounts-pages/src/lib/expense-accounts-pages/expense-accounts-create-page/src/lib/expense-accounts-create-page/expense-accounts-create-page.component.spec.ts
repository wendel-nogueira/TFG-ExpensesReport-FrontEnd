import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountsCreatePageComponent } from './expense-accounts-create-page.component';

describe('ExpenseAccountsCreatePageComponent', () => {
  let component: ExpenseAccountsCreatePageComponent;
  let fixture: ComponentFixture<ExpenseAccountsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountsCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
