import { Injectable } from '@angular/core';
import { Address, Name, Password } from '@expensesreport/models';

@Injectable({
  providedIn: 'root',
})
export class RegisterServiceService {
  register = {
    name: {
      firstName: '',
      lastName: '',
    } as Name,
    address: {
      zip: '',
      country: '',
      state: '',
      city: '',
      address: '',
    } as Address,
    password: {
      password: '',
      confirmPassword: '',
    } as Password,
  };

  getRegister() {
    return this.register;
  }

  setRegister(register: { name: Name; address: Address; password: Password }) {
    this.register = register;
  }
}
