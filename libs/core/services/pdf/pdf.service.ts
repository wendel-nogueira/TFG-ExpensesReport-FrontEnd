import { Injectable } from '@angular/core';
import { TableColumn } from '../../../ui/shared';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ExpenseReport } from '../../models';
import {
  ExpenseReportStatus,
  ExpenseStatus,
  expenseReportStatusToName,
} from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  getColumnWidths(columns: TableColumn[]): any[] {
    const maxTableWidth = 470;

    const idSize = 50;
    const dateSize = 50;
    const tagSize = 40;

    const sizes: number[] = [];

    for (let i = 0; i < columns.length; i++) {
      if (
        columns[i].field === 'id' ||
        columns[i].field === 'code' ||
        columns[i].field === 'acronym'
      ) {
        sizes.push(idSize);
      } else if (columns[i].field === 'date') {
        sizes.push(dateSize);
      } else if (columns[i].field === 'role' || columns[i].field === 'status') {
        sizes.push(tagSize);
      } else if (
        columns[i].field !== 'actions' &&
        columns[i].field !== 'more'
      ) {
        sizes.push(0);
      }
    }

    const toComplete = maxTableWidth - sizes.reduce((a, b) => a + b, 0);
    const totalToComplete = sizes.filter((s) => s === 0).length;
    const sizePerColumn = toComplete / totalToComplete;

    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i] === 0) {
        sizes[i] = sizePerColumn;
      }
    }

    return sizes;
  }

  generateListPDF(
    title: string,
    columns: TableColumn[],
    data: any
  ): Promise<void> {
    return new Promise((resolve) => {
      const now = new Date();
      const generatedOn = `${now.getMonth() + 1 < 10 ? '0' : ''}${
        now.getMonth() + 1
      }/${now.getDate() < 10 ? '0' : ''}${now.getDate()}/${now.getFullYear()} ${
        now.getHours() < 10 ? '0' : ''
      }${now.getHours()}:${
        now.getMinutes() < 10 ? '0' : ''
      }${now.getMinutes()}`;

      const tableColumns = columns
        .filter(
          (column) => column.field !== 'actions' && column.field !== 'more'
        )
        .map((column) => {
          return {
            text: column.header,
            style: 'tableHeader',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          };
        });

      var document = {
        content: [
          {
            columns: [
              {
                width: 150,
                stack: [
                  {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" width="24" height="24" color="#475FEB" fill="none"><path d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><path d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z" stroke="currentColor" stroke-width="1.5" /><path d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
                    width: 80,
                    style: 'title',
                    margin: [0, 0, 0, 0],
                    background: 'red',
                  },
                ],
                alignment: 'left',
                margin: [20, 20, 0, 0],
              },
              {
                width: '*',
                stack: [
                  {
                    text: 'Expenses Report Application',
                    style: 'header',
                    alignment: 'right',
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        text: '456 Elm St, Adams',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'CA, US - 54321',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'Email: tfgexpensesreport@gmail.com',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'Phone: +55 (XX) X XXXX-XXXX',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                    ],
                    alignment: 'right',
                    margin: [0, 10, 0, 0],
                  },
                ],
                alignment: 'right',
                margin: [0, 20, 0, 0],
              },
            ],
          },
          {
            width: '*',
            stack: [
              {
                text: `List: ${title}`,
                style: 'subtitle',
                alignment: 'left',
              },
              {
                width: '*',
                stack: [
                  {
                    text: `Generated on: ${generatedOn}`,
                    style: 'subheader',
                    alignment: 'left',
                  },
                ],
                alignment: 'left',
                margin: [0, 10, 0, 0],
              },
            ],
            alignment: 'left',
            margin: [0, 50, 0, 0],
          },
          {
            table: {
              headerRows: 1,
              widths: this.getColumnWidths(columns),
              body: [
                tableColumns,
                ...data.map((row: any) => {
                  return columns
                    .filter(
                      (column) =>
                        column.field !== 'actions' && column.field !== 'more'
                    )
                    .map((column) => {
                      return {
                        text: row[column.field],
                        style: 'tableBody',
                        alignment: 'center',
                        margin: [0, 10, 0, 10],
                      };
                    });
                }),
              ],
            },
            layout: {
              fillColor: function (rowIndex: number) {
                if (rowIndex === 0) {
                  return '#475FEB';
                }
                return rowIndex % 2 === 0 ? '#f2f2f2' : '#fafafa';
              },
              vLineWidth: function () {
                return 0;
              },
              hLineWidth: function () {
                return 0;
              },
              paddingLeft: function () {
                return 4;
              },
              paddingRight: function () {
                return 4;
              },
            },
            margin: [0, 30, 0, 0],
          },
        ],
        styles: {
          title: {
            font: 'Roboto',
            fontSize: 20,
            bold: true,
            color: '#475FEB',
          },
          header: {
            font: 'Roboto',
            fontSize: 16,
            bold: true,
            color: '#625F79',
          },
          subheader: {
            font: 'Roboto',
            fontSize: 12,
            bold: false,
            color: '#625F79',
          },
          subtitle: {
            font: 'Roboto',
            fontSize: 14,
            bold: true,
            color: '#625F79',
          },
          tableHeader: {
            font: 'Roboto',
            fontSize: 12,
            bold: false,
            color: '#fafafa',
          },
          tableBody: {
            font: 'Roboto',
            fontSize: 10,
            bold: true,
            color: '#625F79',
          },
        },
      } as any;

      pdfMake
        .createPdf(document)
        .download(`list_${title}_${now.getTime()}.pdf`);

      resolve();
    });
  }

  generateExpenseReportPDF(expenseReport: ExpenseReport): Promise<void> {
    return new Promise((resolve) => {
      const expenses: any = [];

      expenseReport.expenses?.forEach((expense) => {
        const date = new Date(expense.dateIncurred!);
        const dateToString = `${date.getMonth() + 1 < 10 ? '0' : ''}${
          date.getMonth() + 1
        }/${
          date.getDate() < 10 ? '0' : ''
        }${date.getDate()}/${date.getFullYear()}\n(${
          expense.dateIncurredTimeZone
        })`;

        expenses.push([
          {
            text: `${expense.expenseAccount?.code} - ${expense.expenseAccount?.name}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: `$${expense.amount}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: dateToString,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: `${
              expense.status === ExpenseStatus.Approved
                ? 'Approved'
                : expense.status === ExpenseStatus.Rejected
                ? 'Rejected'
                : 'Pending'
            }`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
            color:
              expense.status === ExpenseStatus.Approved
                ? '#00A86B'
                : expense.status === ExpenseStatus.Rejected
                ? '#FF0000'
                : '#FFA500',
          },
          {
            text: `${
              expense.actionBy === null
                ? 'N/A'
                : expense.actionBy?.firstName + ' ' + expense.actionBy?.lastName
            }`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: {
              text: 'View',
              decoration: 'underline',
              color: '#475FEB',
            },
            link: expense.receipt,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
        ]);
      });

      const signatures: any = [];

      expenseReport.signatures?.forEach((signature) => {
        const date = new Date(signature.signatureDate!);
        const dateToString = `${date.getMonth() + 1 < 10 ? '0' : ''}${
          date.getMonth() + 1
        }/${
          date.getDate() < 10 ? '0' : ''
        }${date.getDate()}/${date.getFullYear()}`;

        signatures.push([
          {
            text: `${signature.user?.identity?.email}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: `${signature.user?.firstName} ${signature.user?.lastName}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: dateToString,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          {
            text: `${signature.acceptance ? 'yes' : 'no'}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
            color: signature.acceptance ? '#00A86B' : '#FF0000',
          },
          {
            text: `${signature.ipAddress}`,
            style: 'tableBody',
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
        ]);
      });

      let payment: any = [];

      if (expenseReport.status === ExpenseReportStatus.PaymentRejected) {
        payment = [
          {
            text: `Rejection notes: ${expenseReport.rejectionNotes}`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 2, 0, 0],
          },
        ];
      } else if (
        expenseReport.status === ExpenseReportStatus.Paid ||
        expenseReport.status === ExpenseReportStatus.PartiallyPaid
      ) {
        payment = [
          {
            text: `Paid by: ${expenseReport.paidBy?.firstName} ${expenseReport.paidBy?.lastName}`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 2, 0, 0],
          },
          {
            text: `Paid date: ${expenseReport.paidDate} (${expenseReport.paidDateTimeZone})`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 2, 0, 0],
          },
          {
            text: {
              text: 'Proof of Payment',
              style: 'subheader',
              alignment: 'left',
              margin: [0, 2, 0, 0],
              decoration: 'underline',
              color: '#475FEB',
            },
            link: expenseReport.proofOfPayment,
          },
          {
            text: `Payment notes: ${expenseReport.paymentNotes}`,
            style: 'subheader',
            alignment: 'left',
            margin: [0, 2, 0, 0],
          },
        ];
      }

      var document = {
        content: [
          {
            columns: [
              {
                width: 150,
                stack: [
                  {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" width="24" height="24" color="#475FEB" fill="none"><path d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><path d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z" stroke="currentColor" stroke-width="1.5" /><path d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>',
                    width: 80,
                    style: 'title',
                    margin: [0, 0, 0, 0],
                    background: 'red',
                  },
                ],
                alignment: 'left',
                margin: [20, 20, 0, 0],
              },
              {
                width: '*',
                stack: [
                  {
                    text: 'Expenses Report Application',
                    style: 'header',
                    alignment: 'right',
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        text: '456 Elm St, Adams',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'CA, US - 54321',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'Email: tfgexpensesreport@gmail.com',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: 'Phone: +55 (XX) X XXXX-XXXX',
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                    ],
                    alignment: 'right',
                    margin: [0, 10, 0, 0],
                  },
                ],
                alignment: 'right',
                margin: [0, 20, 0, 0],
              },
            ],
          },
          {
            text: `EXPENSE REPORT`,
            alignment: 'center',
            style: 'subtitle',
            margin: [0, 30, 0, 0],
          },
          {
            columns: [
              {
                width: '*',
                stack: [
                  {
                    text: 'User Details',
                    style: 'header',
                    alignment: 'left',
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        text: `${expenseReport.user?.firstName} ${expenseReport.user?.lastName}`,
                        style: 'subheader',
                        alignment: 'left',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `${expenseReport.user?.identity?.email}`,
                        style: 'subheader',
                        alignment: 'left',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `${expenseReport.user?.address}, ${expenseReport.user?.city}`,
                        style: 'subheader',
                        alignment: 'left',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `${expenseReport.user?.state}, ${expenseReport.user?.country} - ${expenseReport.user?.zip}`,
                        style: 'subheader',
                        alignment: 'left',
                        margin: [0, 2, 0, 0],
                      },
                    ],
                    alignment: 'right',
                    margin: [0, 10, 0, 0],
                  },
                ],
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              {
                width: '*',
                stack: [
                  {
                    text: 'Report Details',
                    style: 'header',
                    alignment: 'right',
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        text: `#${expenseReport.id}`,
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `Department: ${expenseReport.department?.acronym} - ${expenseReport.department?.name}`,
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `Project: ${expenseReport.project?.code} - ${expenseReport.project?.name}`,
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                      {
                        text: `Status: ${expenseReportStatusToName(
                          expenseReport.status!
                        )}`,
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 2, 0, 0],
                      },
                    ],
                    alignment: 'right',
                    margin: [0, 10, 0, 0],
                  },
                ],
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
            ],
            margin: [0, 30, 0, 0],
          },
          {
            table: {
              headerRows: 1,
              widths: [120, 50, 100, 40, 100, 60],
              body: [
                [
                  {
                    text: 'account',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'amount',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'date',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'status',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'action by',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'Receipt',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                ],
                ...expenses,
              ],
            },
            layout: {
              fillColor: function (rowIndex: number) {
                if (rowIndex === 0) {
                  return '#475FEB';
                }
                return rowIndex % 2 === 0 ? '#f2f2f2' : '#fafafa';
              },
              vLineWidth: function () {
                return 0;
              },
              hLineWidth: function () {
                return 0;
              },
              paddingLeft: function () {
                return 4;
              },
              paddingRight: function () {
                return 4;
              },
            },
            margin: [0, 50, 0, 0],
          },
          {
            table: {
              headerRows: 0,
              widths: [80, 80],
              body: [
                [
                  {
                    text: 'Total',
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                  {
                    text: `$${expenseReport.totalAmount ?? 0.0}`,
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                ],
                [
                  {
                    text: 'Total approved',
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                  {
                    text: `$${expenseReport.amountApproved ?? 0.0}`,
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                ],
                [
                  {
                    text: 'Total rejected',
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                  {
                    text: `$${expenseReport.amountRejected ?? 0.0}`,
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                ],
                [
                  {
                    text: 'Total paid',
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                  {
                    text: `$${expenseReport.amountPaid ?? 0.0}`,
                    style: 'tableBody',
                    margin: [0, 5, 0, 5],
                    alignment: 'right',
                    fontSize: 10,
                    bold: false,
                  },
                ],
              ],
              alignment: 'right',
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex % 2 === 0 ? '#f2f2f2' : '#fafafa';
              },
              vLineWidth: function () {
                return 0;
              },
              hLineWidth: function () {
                return 0;
              },
              paddingLeft: function () {
                return 4;
              },
              paddingRight: function () {
                return 4;
              },
            },
            margin: [330, 10, 0, 0],
          },
          payment.length > 0
            ? {
                width: '*',
                stack: [
                  {
                    text: 'Payment Info',
                    style: 'header',
                    alignment: 'left',
                  },
                  {
                    width: '*',
                    stack: [...payment],
                    alignment: 'right',
                    margin: [0, 10, 0, 0],
                  },
                ],
                alignment: 'right',
                margin: [0, 40, 0, 0],
              }
            : {},
          {
            text: 'Signatures',
            margin: [0, 40, 0, 0],
            style: 'header',
            alignment: 'center',
          },
          {
            table: {
              headerRows: 1,
              widths: [160, 100, 60, 70, 90],
              body: [
                [
                  {
                    text: 'user',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'name',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'date',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'acceptance',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                  {
                    text: 'IP address',
                    style: 'tableHeader',
                    margin: [0, 10, 0, 10],
                    alignment: 'center',
                  },
                ],
                ...signatures,
              ],
            },
            layout: {
              fillColor: function (rowIndex: number) {
                if (rowIndex === 0) {
                  return '#475FEB';
                }
                return rowIndex % 2 === 0 ? '#f2f2f2' : '#fafafa';
              },
              vLineWidth: function () {
                return 0;
              },
              hLineWidth: function () {
                return 0;
              },
              paddingLeft: function () {
                return 4;
              },
              paddingRight: function () {
                return 4;
              },
            },
            margin: [0, 20, 0, 0],
          },
        ],
        styles: {
          title: {
            font: 'Roboto',
            fontSize: 20,
            bold: true,
            color: '#475FEB',
          },
          header: {
            font: 'Roboto',
            fontSize: 16,
            bold: true,
            color: '#625F79',
          },
          subheader: {
            font: 'Roboto',
            fontSize: 12,
            bold: false,
            color: '#625F79',
          },
          subtitle: {
            font: 'Roboto',
            fontSize: 14,
            bold: true,
            color: '#625F79',
          },
          tableHeader: {
            font: 'Roboto',
            fontSize: 12,
            bold: false,
            color: '#fafafa',
          },
          tableBody: {
            font: 'Roboto',
            fontSize: 8,
            bold: true,
            color: '#625F79',
          },
        },
      } as any;

      pdfMake
        .createPdf(document)
        .download(
          `expense_report_${expenseReport.id}_${Date.now().toString()}.pdf`
        );

      resolve();
    });
  }
}
