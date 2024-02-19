export const validationMessages = {
  title: {
    required: 'Required',
    minlength: 'Must be of aleast 6 chars.',
  },
  description: {
    required: 'Required',
    minlength: 'Must be of aleast 6 chars.',
  },
  employeeId: {
    required: 'Required',
    notNull: 'Select Employee',
  },
  date: {
    required: 'Required',
    pattern: 'InValid date format',
  },
  deadlineDate: {
    required: 'Required',
    notNull: 'Select deadline Date',
  },
  deadlineTime: {
    required: 'Required',
    notNull: 'Select deadline Time',
  },
};
