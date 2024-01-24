import { AbstractControl, ValidationErrors } from '@angular/forms';

export const trimValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (!value || value === '') return null;

  if (value.startsWith(' ') || value.endsWith(' ')) {
    control.setValue(control.value?.trim(), {
      emitEvent: false,
      onlySelf: true,
    });
  }

  return null;
};
