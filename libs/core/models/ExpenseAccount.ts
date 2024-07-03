import { ExpenseAccountCategory } from './ExpenseAccountCategory';
import { ExpenseAccountType, ExpenseAccountStatus } from '../enums';

export interface ExpenseAccount {
  id?: string;
  category?: ExpenseAccountCategory;
  categoryId?: string;
  name: string;
  code: string;
  description: string;
  type: ExpenseAccountType;
  status?: ExpenseAccountStatus;
}
