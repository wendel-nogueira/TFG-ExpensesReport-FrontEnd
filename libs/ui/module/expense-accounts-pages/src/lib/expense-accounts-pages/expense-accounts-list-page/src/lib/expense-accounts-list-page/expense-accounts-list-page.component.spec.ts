import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountsListPageComponent } from './expense-accounts-list-page.component';

describe('ExpenseAccountsListPageComponent', () => {
  let component: ExpenseAccountsListPageComponent;
  let fixture: ComponentFixture<ExpenseAccountsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountsListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
