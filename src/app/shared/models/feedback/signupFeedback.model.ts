export class SignUpFeedback {
  name: string;
  email: string;
  password: string;
  employeeType: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: string;

  constructor(
    name: string = '',
    email: string = '',
    password: string = '',
    employeeType: string = '',
    address: string = '',
    city: string = '',
    country: string = '',
    phone: string = '',
    departmentID: string = '',
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.employeeType = employeeType;
    this.address = address;
    this.city = city;
    this.country = country;
    this.phone = phone;
    this.departmentID = departmentID;
  }
}
