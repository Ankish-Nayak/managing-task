export const UPDATE_PROFILE_VALIDAION_MESSAGES = {
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
  departmentName: {},
};
