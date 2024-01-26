import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const notNullValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value as string;
    if (inputValue && inputValue.toLowerCase() === 'null') {
      return {
        notNull: true, //  validation error when null if found
      };
    }
    return null;
  };
};
