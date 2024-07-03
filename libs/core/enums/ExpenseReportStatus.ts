export enum ExpenseReportStatus {
  Created = 0,
  SubmittedForApproval = 1,
  ApprovedBySupervisor = 2,
  RejectedBySupervisor = 3,
  PartiallyPaid = 4,
  Paid = 5,
  PaymentRejected = 6,
  Cancelled = 7,
}

export function expenseReportStatusToName(status: ExpenseReportStatus): string {
  const statuses = {
    0: 'Created',
    1: 'Submitted for Approval',
    2: 'Approved by Supervisor',
    3: 'Rejected by Supervisor',
    4: 'Partially Paid',
    5: 'Paid',
    6: 'Payment Rejected',
    7: 'Cancelled',
  };

  return statuses[status];
}
