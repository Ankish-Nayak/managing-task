import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
//TODO:make it work
export const allowedValuesValidator = (
  allowedValues: number[],
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      !control.value ||
      allowedValues.some((value) => value === control.value)
    ) {
      // allowed values
      return null; // no validation error
    } else {
      // not allowed values
      return { allowedValue: true };
    }
  };
};
