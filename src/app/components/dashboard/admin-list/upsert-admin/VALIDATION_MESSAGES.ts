export const VALIDATION_MESSAGES = {
  email: {
    required: 'Required',
    email: 'Invalid email address',
  },
  name: {
    required: 'Required',
  },
  city: {
    required: 'Required',
  },
  address: {
    required: 'Required',
  },
  country: {
    pattern: 'Must be alphabets.',
    required: 'Required',
  },
  phone: {
    pattern: 'Must be numbers.',
    required: 'Required',
  },
  departmentID: {
    required: 'Required',
    notNull: 'Select department',
  },
  employeeType: {
    required: 'Required',
    allowedvalue: 'Select from dropdown',
  },
  password: {
    required: 'Required',
    minlength: 'Must be of atleast 8 chars.',
    pattern:
      'Must contain at least one uppercase letter, one digit, and one special character',
  },
};
