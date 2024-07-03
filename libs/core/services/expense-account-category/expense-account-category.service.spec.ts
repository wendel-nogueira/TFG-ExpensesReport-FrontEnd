import { TestBed } from '@angular/core/testing';

import { ExpenseAccountCategoryService } from './expense-account-category.service';

describe('ExpenseAccountCategoryService', () => {
  let service: ExpenseAccountCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseAccountCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
