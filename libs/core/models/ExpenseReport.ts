import { Department, Expense, Project, Signature, User } from "./";
import { ExpenseReportStatus } from "../enums";

export interface ExpenseReport {
  id?: string;
  userId?: string;
  user?: User;
  departmentId: string;
  department?: Department;
  projectId: string;
  project?: Project;
  status?: ExpenseReportStatus;
  totalAmount?: number;
  amountApproved?: number;
  amountRejected?: number;
  amountPaid?: number;
  paidById?: string;
  paidBy?: User;
  paidDate?: Date;
  paidDateTimeZone?: string;
  paymentNotes?: string;
  rejectionNotes?: string;
  proofOfPayment?: string;
  expenses?: Expense[];
  signatures?: Signature[];
}
