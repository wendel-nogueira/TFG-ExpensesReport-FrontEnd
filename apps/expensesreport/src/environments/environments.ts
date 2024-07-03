export const environments: Environments = {
  production: false,
  googleClientId:
    '696644256985-l3bsmo69gjv44b88hvd8320eb79mh16u.apps.googleusercontent.com',
  addressApiExternal: 'https://countriesnow.space/api/v0.1/countries',
  zipApiExternal: 'https://app.zipcodebase.com/api/v1',
  zipApiKey: '7ad4eaf0-10a4-11ef-8bb3-dff82ca1359e',

  jwtToken: 'uNNtAoquY3kUMt1BsvLcUqf51rovyv2e',
  jwtDomain: 'https://api-auth.yelluh.xyz/',
  authenticationApiURL: 'https://api-auth.yelluh.xyz/v1/auth',
  usersApiURL: 'https://api-user.yelluh.xyz/v1/users',
  departmentsApiURL: 'https://api-department.yelluh.xyz/v1/departments',
  projectsApiURL: 'https://api-project.yelluh.xyz/v1/projects',
  seasonsApiURL: 'https://api-project.yelluh.xyz/v1/seasons',
  expensesApiURL: 'https://api-expense.yelluh.xyz/v1/expense',
  expenseReportsApiURL: 'https://api-expense.yelluh.xyz/v1/expense-report',
  expenseAccountsApiURL: 'https://api-expense.yelluh.xyz/v1/expense-account',
  expenseAccountCategoriesApiURL:
    'https://api-expense.yelluh.xyz/v1/expense-account-category',
  filesApiURL: 'https://api-file.yelluh.xyz/v1/files',
};

export interface Environments {
  production: boolean;
  googleClientId: string;
  addressApiExternal: string;
  zipApiExternal: string;
  zipApiKey: string;

  jwtToken: string;
  jwtDomain: string;
  authenticationApiURL: string;
  usersApiURL: string;
  departmentsApiURL: string;
  projectsApiURL: string;
  seasonsApiURL: string;
  expensesApiURL: string;
  expenseReportsApiURL: string;
  expenseAccountsApiURL: string;
  expenseAccountCategoriesApiURL: string;
  filesApiURL: string;
}
