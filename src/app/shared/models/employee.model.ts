export class Employee {
  id: number;
  name: string;
  email: string;
  employeeType: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  departmentID: number;
  departmentName: string;

  constructor(
    id: number,
    name: string,
    email: string,
    employeeType: number,
    address: string,
    city: string,
    country: string,
    phone: string,
    departmentID: number,
    departmentName: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.employeeType = employeeType;
    this.address = address;
    this.city = city;
    this.country = country;
    this.phone = phone;
    this.departmentID = departmentID;
    this.departmentName = departmentName;
  }
}

export class EmployeeAdapter {
  adapt(item: any): Employee {
    return new Employee(
      item.id,
      item.name,
      item.email,
      item.employeeType,
      item.address,
      item.city,
      item.country,
      item.phone,
      item.departmentID,
      item.departmentName,
    );
  }

  adaptArray(items: any[]): Employee[] {
    return items.map((item) => this.adapt(item));
  }
}
