export enum UserRoles {
  Admin = 0,
  FieldStaff = 1,
  Manager = 2,
  Accountant = 3,
}

export function roleToName(role: UserRoles): string {
  const roles = {
    0: 'Admin',
    1: 'Field Staff',
    2: 'Manager',
    3: 'Accountant',
  };

  return roles[role];
}
