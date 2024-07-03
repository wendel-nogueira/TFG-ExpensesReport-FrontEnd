import { ExpenseStatus } from '../enums/ExpenseStatus';
import { ExpenseAccount } from './ExpenseAccount';
import { User } from './User';

export interface Expense {
  id?: string;
  expenseAccount?: ExpenseAccount;
  expenseAccountName?: string;
  expenseAccountId?: string;
  amount: number;
  dateIncurred: string;
  dateIncurredTimeZone: string;
  explanation: string;
  status?: ExpenseStatus;
  actionById?: string;
  actionDate?: Date;
  actionDateTimeZone?: string;
  accountingNotes?: string;
  receipt: string;

  actionBy?: User;
}
