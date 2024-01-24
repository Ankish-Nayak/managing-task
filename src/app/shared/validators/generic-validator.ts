import { FormGroup } from '@angular/forms';

// Provide all set of validation messages here
const VALIDATION_MESSAGES = {
  email: {
    required: 'Required',
    email: 'This email is invalid',
  },
  password: {
    required: 'Required',
    minlength: 'The password length must be greater than or equal to 8',
  },
  confirmPassword: {
    required: 'Required',
    match: 'Password does not match',
  },
  firstName: {
    required: 'Required',
  },
  lastName: {
    required: 'Required',
  },
};

export class GenericValidators {
  constructor(
    private validationMessages: {
      [key: string]: { [key: string]: string };
    } = VALIDATION_MESSAGES,
  ) {}

  processMessages(container: FormGroup): { [key: string]: string } {
    const messages: { [key: string]: string } = {};

    // loop through all form control
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        // get the property of each form control
        const controlProperty = container.controls[controlKey];

        // if it is a form group the process its children
        if (controlProperty instanceof FormGroup) {
          const childMessages = this.processMessages(controlProperty);
          Object.assign(messages, childMessages);
        } else {
          // Only validate if there are validation messages for the control
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if (
              (controlProperty.dirty || controlProperty.touched) &&
              controlProperty.errors
            ) {
              // loop through the object of errors
              Object.keys(controlProperty.errors).map((messageKey) => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] +=
                    this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }
}
