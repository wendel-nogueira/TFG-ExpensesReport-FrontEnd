export const environments: Environments = {
  production: false,
  googleClientId:
    '696644256985-l3bsmo69gjv44b88hvd8320eb79mh16u.apps.googleusercontent.com',
  addressApiExternal: 'https://countriesnow.space/api/v0.1/countries',
  zipApiExternal: 'https://app.zipcodebase.com/api/v1',
  zipApiKey: '7ad4eaf0-10a4-11ef-8bb3-dff82ca1359e',

  jwtToken: 'uNNtAoquY3kUMt1BsvLcUqf51rovyv2e',
  jwtDomain: 'http://localhost:5200/',
  authenticationApiURL: 'http://48.217.59.48:8081/v1/auth',
  usersApiURL: 'http://48.217.59.48:8082/v1/users',
  departmentsApiURL: 'http://48.217.59.48:8083/v1/departments',
  projectsApiURL: 'http://48.217.59.48:8084/v1/projects',
  seasonsApiURL: 'http://48.217.59.48:8084/v1/seasons',
  expensesApiURL: 'http://48.217.59.48:8085/v1/expense',
  expenseReportsApiURL: 'http://48.217.59.48:8085/v1/expense-report',
  expenseAccountsApiURL: 'http://48.217.59.48:8085/v1/expense-account',
  expenseAccountCategoriesApiURL:
    'http://48.217.59.48:8085/v1/expense-account-category',
  filesApiURL: 'http://48.217.59.48:8086/v1/files',
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
