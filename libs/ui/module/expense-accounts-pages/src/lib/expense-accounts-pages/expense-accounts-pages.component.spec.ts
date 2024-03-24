import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAccountsPagesComponent } from './expense-accounts-pages.component';

describe('ExpenseAccountsPagesComponent', () => {
  let component: ExpenseAccountsPagesComponent;
  let fixture: ComponentFixture<ExpenseAccountsPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountsPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseAccountsPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
