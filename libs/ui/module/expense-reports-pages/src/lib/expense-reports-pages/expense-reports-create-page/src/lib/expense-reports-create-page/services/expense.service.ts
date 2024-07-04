import { Injectable } from '@angular/core';
import { Expense } from '@expensesreport/models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  register: {
    department: string;
    project: string;
    expenses: Expense[];
  } = {
    department: '',
    project: '',
    expenses: [],
  };

  getRegister() {
    return this.register;
  }

  setDepartment(department: string) {
    this.register.department = department;
  }

  setProject(project: string) {
    this.register.project = project;
  }

  getExpense(id: string) {
    return this.register.expenses.find((e) => e.id === id);
  }

  addExpense(expense: Expense) {
    this.register.expenses.push(expense);
  }

  editExpense(expense: Expense) {
    const index = this.register.expenses.findIndex((e) => e.id === expense.id);
    console.log(index);

    if (index === -1) {
      return;
    }

    this.register.expenses[index] = expense;
  }

  removeExpense(expense: Expense) {
    this.register.expenses = this.register.expenses.filter(
      (e) => e.id !== expense.id
    );
  }

  clear() {
    this.register = {
      department: '',
      project: '',
      expenses: [],
    };
  }
}
